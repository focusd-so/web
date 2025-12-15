import { EventEmitter } from "events";
import { readFileSync, existsSync } from "fs";
import { Knex, knex } from "knex";
import { Datasource, SSLConfig } from "./types";
import { connectionsStorage } from "./connections-storage";

// Connection types
type SQLConnection = {
  type: "sql";
  client: Knex;
  datasource: Datasource;
};

type Connection = SQLConnection;

export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  FAILED = "failed",
}

// Connection metadata
export interface ConnectionMetadata {
  id: string;
  name: string;
  state: ConnectionState;
  connection: Connection | null;
  retryCount: number;
  datasource: Datasource;
  lastError?: string;
  createdAt: Date;
  lastConnectedAt?: Date;
}

export const connections: Map<string, ConnectionMetadata> = new Map();
export const CONNECTIONS_UPDATED_EVENT = "connections:updated";
export const connectionEvents = new EventEmitter();

export type ConnectionSnapshot = {
  id: string;
  name: string;
  state: ConnectionState;
  retryCount: number;
  lastError?: string;
  createdAt: string;
  lastConnectedAt?: string;
  connectionString?: string;
};

function emitConnectionsUpdated(): void {
  console.log("EMITTING CONNECTIONS UPDATED");
  const snapshot = getConnectionSnapshots();
  console.log("CONNECTIONS UPDATED: ", snapshot);
  connectionEvents.emit(CONNECTIONS_UPDATED_EVENT, snapshot);
}

export function getConnectionSnapshots(): ConnectionSnapshot[] {
  return Array.from(connections.values()).map((metadata) => ({
    id: metadata.id,
    name: metadata.name,
    state: metadata.state,
    retryCount: metadata.retryCount,
    lastError: metadata.lastError,
    createdAt: metadata.createdAt.toISOString(),
    lastConnectedAt: metadata.lastConnectedAt?.toISOString(),
    connectionString: formatDatasourceConnectionString(metadata.datasource),
  }));
}

export async function createConnection(
  datasource: Datasource
): Promise<Connection> {
  return await getOrCreateConnection(datasource);
}

export async function testConnection(datasource: Datasource): Promise<void> {
  const connection = await createSQLConnection(datasource);
  await closeConnection(connection);
}

/**
 * Check if a datasource type requires a password for connection
 */
function datasourceRequiresPassword(datasource: Datasource): boolean {
  switch (datasource.type) {
    case "postgres":
    case "mysql":
    case "mariadb":
    case "cockroachdb":
    case "mongodb":
      return true;
    case "sqlite":
      return false;
    case "libsql":
      // LibSQL may require authToken, not password
      return false;
    default:
      return false;
  }
}

/**
 * Check if a datasource is missing its password and needs rehydration
 */
function needsPasswordRehydration(datasource: Datasource): boolean {
  if (!datasource.id) return false;
  if (!datasourceRequiresPassword(datasource)) return false;
  
  // Check if password field exists and has a value
  if ("password" in datasource && datasource.password) {
    return false;
  }
  
  return true;
}

/**
 * Get or create a connection
 */
async function getOrCreateConnection(
  datasource: Datasource
): Promise<Connection> {
  const connectionId = generateConnectionId(datasource);
  const existing = connections.get(connectionId);


  if (
    existing &&
    existing.state === ConnectionState.CONNECTED &&
    existing.connection
  ) {
    // Touch connection usage
    connectionsStorage.touchConnection(datasource.id).catch(console.error);
    return existing.connection;
  }

  // If connection is being created, wait for it
  if (existing && existing.state === ConnectionState.CONNECTING) {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const current = connections.get(connectionId);
        if (
          current?.state === ConnectionState.CONNECTED &&
          current.connection
        ) {
          clearInterval(checkInterval);
          resolve(current.connection);
        } else if (current?.state === ConnectionState.FAILED) {
          clearInterval(checkInterval);
          reject(new Error(current.lastError || "Connection failed"));
        }
      }, 100);

      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Connection timeout"));
      }, 30000);
    });
  }

  // Rehydrate secrets (password) if missing
  let hydratedDatasource = datasource;
  if (needsPasswordRehydration(datasource)) {
    hydratedDatasource = await connectionsStorage.rehydrateDatasourceSecrets(datasource);
  }

  // Create new connection
  const metadata: ConnectionMetadata = {
    id: connectionId,
    name: hydratedDatasource.name,
    state: ConnectionState.CONNECTING,
    connection: null,
    retryCount: 0,
    datasource: hydratedDatasource,
    createdAt: new Date(),
  };
  connections.set(connectionId, metadata);
  emitConnectionsUpdated();

  try {
    const connection = await createSQLConnection(hydratedDatasource);
    metadata.connection = connection;
    metadata.state = ConnectionState.CONNECTED;
    metadata.lastConnectedAt = new Date();
    connections.set(connectionId, metadata);
    emitConnectionsUpdated();

    // Setup connection monitoring
    setupConnectionMonitoring(connectionId);

    // Touch connection usage
    connectionsStorage.touchConnection(hydratedDatasource.id).catch(console.error);

    return connection;
  } catch (error) {
    metadata.state = ConnectionState.FAILED;
    metadata.lastError = (error as Error).message;
    connections.set(connectionId, metadata);
    emitConnectionsUpdated();
    throw error;
  }
}

function setupConnectionMonitoring(connectionId: string): void {
  const metadata = connections.get(connectionId);
  if (!metadata || !metadata.connection) return;

  const connection = metadata.connection;

  // Setup error handlers
  if (connection.type === "sql") {
    connection.client.on("error", (error: Error) => {
      console.error(`SQL connection ${connectionId} error:`, error);
      handleConnectionLost(connectionId);
    });
    // Knex doesn't expose connection pool events directly,
    // we'll rely on query failures to trigger reconnection
  } else if (connection.type === "mongodb") {
    connection.client.on("close", () => {
      console.log(`MongoDB connection ${connectionId} closed`);
      handleConnectionLost(connectionId);
    });

    connection.client.on("error", (error: Error) => {
      console.error(`MongoDB connection ${connectionId} error:`, error);
      handleConnectionLost(connectionId);
    });
  } else if (connection.type === "libsql") {
    // LibSQL client doesn't expose events, we'll rely on query failures
  }
}

async function handleConnectionLost(connectionId: string): Promise<void> {
  const metadata = connections.get(connectionId);
  if (!metadata) return;

  // Don't retry if already disconnected or failed
  if (
    metadata.state === ConnectionState.DISCONNECTED ||
    metadata.state === ConnectionState.FAILED
  ) {
    return;
  }

  metadata.state = ConnectionState.DISCONNECTED;
  connections.set(connectionId, metadata);
  emitConnectionsUpdated();

  // Attempt reconnection
  await attemptReconnection(connectionId);
}

async function attemptReconnection(connectionId: string): Promise<void> {
  const metadata = connections.get(connectionId);
  if (!metadata || !metadata.connection) return;

  const datasource = metadata.datasource;

  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`Reconnection attempt ${attempt}/3 for ${connectionId}`);

    metadata.retryCount = attempt;
    connections.set(connectionId, metadata);

    try {
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close old connection
      await closeConnection(metadata.connection);

      // Create new connection
      const newConnection = await createConnection(datasource);
      metadata.connection = newConnection;
      metadata.state = ConnectionState.CONNECTED;
      metadata.lastConnectedAt = new Date();
      metadata.retryCount = 0;
      connections.set(connectionId, metadata);
      emitConnectionsUpdated();

      console.log(`Successfully reconnected ${connectionId}`);
      return;
    } catch (error) {
      console.error(
        `Reconnection attempt ${attempt} failed for ${connectionId}:`,
        error
      );
      metadata.lastError = (error as Error).message;
      connections.set(connectionId, metadata);
      emitConnectionsUpdated();
    }
  }

  // All retries failed, mark as failed and remove from pool
  console.error(
    `All reconnection attempts failed for ${connectionId}. Removing from pool.`
  );
  metadata.state = ConnectionState.FAILED;
  connections.set(connectionId, metadata);
  emitConnectionsUpdated();

  // Remove after marking as failed
  await removeConnection(connectionId);
}

function closeConnection(connection: Connection): Promise<void> {
  if (connection.type === "sql") {
    return connection.client.destroy();
  }
}
/**
 * Read certificate file contents from a file path
 * Returns the file contents as a string, or undefined if the file doesn't exist
 */
function readCertFile(filePath: string | undefined): string | undefined {
  if (!filePath) return undefined;
  
  try {
    if (!existsSync(filePath)) {
      console.warn(`Certificate file not found: ${filePath}`);
      return undefined;
    }
    return readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`Failed to read certificate file: ${filePath}`, error);
    return undefined;
  }
}

function buildSSLConfig(ssl: SSLConfig): Knex.PgConnectionConfig["ssl"] {
  if (ssl.mode === "DISABLED") {
    return false;
  }

  const config: Knex.PgConnectionConfig["ssl"] = {
    rejectUnauthorized: ssl.mode === "VERIFY-FULL" || ssl.mode === "VERIFY-CA",
  };

  // Read certificate file contents from file paths
  if (ssl.ca) {
    const caContent = readCertFile(ssl.ca);
    if (caContent) {
      config.ca = caContent;
    }
  }
  if (ssl.cert) {
    const certContent = readCertFile(ssl.cert);
    if (certContent) {
      config.cert = certContent;
    }
  }
  if (ssl.key) {
    const keyContent = readCertFile(ssl.key);
    if (keyContent) {
      config.key = keyContent;
    }
  }

  return config;
}

function formatDatasourceConnectionString(
  datasource: Datasource
): string | undefined {
  switch (datasource.type) {
    case "postgres":
    case "mysql":
    case "mariadb":
    case "cockroachdb":
      return formatHostBasedConnectionString({
        protocol: datasource.type,
        host: datasource.host,
        port: datasource.port,
        database: datasource.database,
        username: datasource.username,
      });
    case "mongodb":
      return datasource.connectionString;
    case "sqlite":
      return `sqlite:${datasource.filePath}`;
    case "libsql":
      return datasource.url.startsWith("libsql://")
        ? datasource.url
        : `libsql:${datasource.url}`;
    default:
      return undefined;
  }
}

function formatHostBasedConnectionString({
  protocol,
  host,
  port,
  database,
  username,
}: {
  protocol: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
}): string | undefined {
  if (!host) {
    return undefined;
  }

  const auth = username ? `${username}@` : "";
  const portSegment = port ? `:${port}` : "";
  const databaseSegment = database ? `/${database}` : "";
  return `${protocol}://${auth}${host}${portSegment}${databaseSegment}`;
}

function generateConnectionId(datasource: Datasource): string {
  switch (datasource.type) {
    case "postgres":
      return `postgres-${datasource.host}:${datasource.port}`;
    case "mysql":
    case "mariadb":
      return `mysql-${datasource.host}:${datasource.port}`;
    case "cockroachdb":
      return `postgres-${datasource.host}:${datasource.port}`;
    case "mongodb": {
      // Extract host:port from connection string if possible, otherwise use full string
      try {
        const url = new URL(datasource.connectionString);
        return `mongodb-${url.hostname}:${url.port || "27017"}`;
      } catch {
        // Fallback to hashing the connection string
        return `mongodb-${Buffer.from(datasource.connectionString).toString("base64").substring(0, 20)}`;
      }
    }
    case "sqlite":
      return `sqlite-${datasource.filePath}`;
    case "libsql":
      return `libsql-${datasource.url}`;
    default:
      throw new Error("Unknown datasource type");
  }
}

/**
 * Create a SQL connection using Knex
 */
async function createSQLConnection(
  datasource: Datasource
): Promise<SQLConnection> {
  let config: Knex.Config;

  switch (datasource.type) {
    case "postgres":
    case "cockroachdb": {
      config = {
        client: "pg",
        connection: {
          host: datasource.host,
          port: datasource.port,
          user: datasource.username,
          password: datasource.password,
          database: datasource.database,
          ssl: datasource.ssl ? buildSSLConfig(datasource.ssl) : undefined,
        },
        pool: {
          min: 2,
          max: 10,
        },
      };
      break;
    }
    case "mysql":
    case "mariadb": {
      config = {
        client: "mysql2",
        connection: {
          host: datasource.host,
          port: datasource.port,
          user: datasource.username,
          password: datasource.password,
          database: datasource.database,
          ssl: datasource.ssl ? buildSSLConfig(datasource.ssl) : undefined,
        },
        pool: {
          min: 2,
          max: 10,
        },
      };
      break;
    }
    case "sqlite": {
      config = {
        client: "better-sqlite3",
        connection: {
          filename: datasource.filePath,
        },
        useNullAsDefault: true,
      };
      break;
    }
    default:
      throw new Error("Unsupported SQL datasource type");
  }

  const client = knex(config);

  // Verify connection by running a simple query
  try {
    await client.raw("SELECT 1");
  } catch (error) {
    await client.destroy();
    throw error;
  }

  return { type: "sql", client, datasource };
}

export async function disconnect(connectionId: string): Promise<void> {
  const metadata = connections.get(connectionId);
  if (!metadata) return;

  // Close the connection
  if (metadata.connection) {
    await closeConnection(metadata.connection);
  }

  // Remove from active connections map (keeps it in stored connections)
  connections.delete(connectionId);
  emitConnectionsUpdated();
}

/**
 * List all databases available on a connection
 */
export async function listDatabases(connectionId: string): Promise<string[]> {
  const metadata = connections.get(connectionId);
  if (!metadata) {
    throw new Error(`Connection "${connectionId}" not found`);
  }

  if (metadata.state !== ConnectionState.CONNECTED || !metadata.connection) {
    throw new Error(`Connection "${connectionId}" is not connected`);
  }

  const connection = metadata.connection;
  if (connection.type !== "sql") {
    throw new Error(
      `Connection "${connectionId}" does not support listing databases`
    );
  }

  const knex = connection.client;
  const datasource = connection.datasource;

  switch (datasource.type) {
    case "postgres":
    case "cockroachdb": {
      const result = await knex.raw(
        "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname"
      );
      return result.rows.map((row: { datname: string }) => row.datname);
    }
    case "mysql":
    case "mariadb": {
      const result = await knex.raw("SHOW DATABASES");
      // MySQL returns results in first element of array
      const rows = Array.isArray(result[0]) ? result[0] : result;
      return rows.map((row: { Database: string }) => row.Database);
    }
    case "sqlite": {
      // SQLite only has one database (the file itself)
      const filename =
        datasource.filePath.split("/").pop() || datasource.filePath;
      return [filename];
    }
    default:
      return [];
  }
}

/**
 * Remove a connection from the pool
 */
export async function removeConnection(connectionId: string): Promise<void> {
  await disconnect(connectionId);
  connections.delete(connectionId);
  emitConnectionsUpdated();
}

/**
 * Disconnect all connections
 */
async function disconnectAll(): Promise<void> {
  const connectionIds = Array.from(connections.keys());
  await Promise.all(connectionIds.map((id) => disconnect(id)));
  emitConnectionsUpdated();
}
