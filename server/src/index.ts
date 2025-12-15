import { verifyToken, createClerkClient } from "@clerk/backend";

export interface Env {
  CLERK_SECRET_KEY: string;
  CLERK_JWT_KEY?: string;
  ALLOWED_ORIGINS: string;
}

// CORS headers helper
function corsHeaders(origin: string, allowedOrigins: string): HeadersInit {
  const origins = allowedOrigins.split(",").map((o) => o.trim());
  const allowedOrigin = origins.includes(origin) ? origin : origins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Handle CORS preflight
function handleOptions(request: Request, env: Env): Response {
  const origin = request.headers.get("Origin") || "";
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, env.ALLOWED_ORIGINS),
  });
}

// Create a sign-in token for the Electron app
async function createSignInToken(
  request: Request,
  env: Env
): Promise<Response> {
  const origin = request.headers.get("Origin") || "";
  const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);

  try {
    // Get the Clerk session token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        {
          status: 401,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }

    const sessionToken = authHeader.slice(7); // Remove "Bearer " prefix

    // Verify the Clerk session token
    let verifiedToken;
    try {
      verifiedToken = await verifyToken(sessionToken, {
        secretKey: env.CLERK_SECRET_KEY,
        jwtKey: env.CLERK_JWT_KEY,
      });
    } catch (error) {
      console.error("Token verification failed:", error);
      return new Response(JSON.stringify({ error: "Invalid session token" }), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const userId = verifiedToken.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID not found in token" }),
        {
          status: 401,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }
    // Create a Clerk client instance
    const clerkClient = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY,
    });

    // Generate a one-time sign-in token for this user
    // This token allows the Electron app to sign in AS this user
    const signInToken = await clerkClient.signInTokens.createSignInToken({
      userId: userId,
      expiresInSeconds: 60, // Short life for security
    });

    return new Response(
      JSON.stringify({
        ticket: signInToken.token,
      }),
      {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating sign-in token:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}

// Main request handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === "OPTIONS") {
      return handleOptions(request, env);
    }

    // Route handling
    if (pathname === "/createSignInToken" && method === "POST") {
      return createSignInToken(request, env);
    }

    // Health check endpoint
    if (pathname === "/health" && method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
};
