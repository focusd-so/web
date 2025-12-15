# Focusd Auth Worker

Cloudflare Worker for generating sign-in tokens for the Focusd desktop app.

## Setup

### 1. Install dependencies

```bash
cd server
pnpm install
```

### 2. Configure secrets

You need to set the following secrets using the Wrangler CLI:

```bash
# Set the Clerk secret key (from Clerk dashboard)
pnpm wrangler secret put CLERK_SECRET_KEY

# Set a secure JWT secret (generate a random 32+ character string)
pnpm wrangler secret put JWT_SECRET
```

### 3. Local development

```bash
pnpm dev
```

The worker will be available at `http://localhost:8787`.

For local development, you can create a `.dev.vars` file with your secrets:

```
CLERK_SECRET_KEY=sk_test_xxxxx
JWT_SECRET=your-secure-jwt-secret-key-here
```

**Note:** Never commit `.dev.vars` to version control!

### 4. Deploy

```bash
# Deploy to Cloudflare
pnpm deploy

# Deploy to production
pnpm deploy:production
```

## Endpoints

### POST /createSignInToken

Creates a sign-in token for the Focusd desktop app.

**Headers:**
- `Authorization: Bearer <clerk-session-token>`

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 300
}
```

The returned token is a JWT that expires in 5 minutes and can be used by the Electron app to authenticate the user.

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Environment Variables

| Variable | Description | Where to set |
|----------|-------------|--------------|
| `CLERK_SECRET_KEY` | Clerk secret key for verifying session tokens | Wrangler secret |
| `JWT_SECRET` | Secret key for signing JWT tokens | Wrangler secret |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `wrangler.toml` |

