import { verifyToken, createClerkClient } from "@clerk/backend";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Env } from "./index";

// Cache TTL: 24 hours in seconds
const CACHE_TTL_SECONDS = 86400;

// Generate SHA-256 hash for cache key
async function generateCacheKey(
  prompt: string,
  contextData: object
): Promise<string> {
  // Sort keys for deterministic serialization
  const sortedData = JSON.stringify(contextData, Object.keys(contextData).sort());
  const input = `${prompt}:${sortedData}`;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  
  return hashHex;
}

// Define input types
interface AppInput {
  type: "app";
  title: string;
  bundle_id: string;
  app_name: string;
}

interface WebsiteInput {
  type: "website";
  url: string;
}

type ClassificationInput = AppInput | WebsiteInput;

async function fetchWebsiteMetadata(
  url: string
): Promise<{ title?: string; description?: string; keywords?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 200); // 200ms hard timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "FocusdBot/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return {};

    const html = await response.text();

    // Simple regex extraction for speed (HTMLRewriter is better but requires stream processing which might be complex for a simple timeout scenario)
    // However, for Workers, HTMLRewriter is efficient. Let's use a simple regex approach for the 200ms constraint.

    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const ogTitleMatch = html.match(
      /<meta\s+property=[\"']og:title[\"']\s+content=[\"'](.*?)[\"']/i
    );
    const descriptionMatch = html.match(
      /<meta\s+name=[\"']description[\"']\s+content=[\"'](.*?)[\"']/i
    );
    const ogDescriptionMatch = html.match(
      /<meta\s+property=[\"']og:description[\"']\s+content=[\"'](.*?)[\"']/i
    );

    return {
      title: ogTitleMatch?.[1] || titleMatch?.[1],
      description: ogDescriptionMatch?.[1] || descriptionMatch?.[1],
    };
  } catch (e) {
    // Ignore errors (timeout or fetch failure)
    return {};
  }
}

// CORS headers helper (matching index.ts pattern)
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

export async function handleClassification(
  request: Request,
  env: Env
): Promise<Response> {
  const origin = request.headers.get("Origin") || "";
  const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);

  // 2. Auth Verification (JWT)
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

  const sessionToken = authHeader.slice(7);
  let verifiedToken;
  try {
    verifiedToken = await verifyToken(sessionToken, {
      secretKey: env.CLERK_SECRET_KEY,
      jwtKey: env.CLERK_JWT_KEY,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid session token" }), {
      status: 401,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  const userId = verifiedToken.sub;
  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID not found" }), {
      status: 401,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  // 3. Subscription Check
  const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  const user = await clerkClient.users.getUser(userId);

  // Assume plan is in publicMetadata.plan. Default to 'trial' or 'starter' if not set?
  // User prompt: "currently there's only tree trial, starter and pro"
  const plan = (user.publicMetadata as any)?.plan || "trial";

  const allowedPlans = ["trial", "starter", "pro"];
  if (!allowedPlans.includes(plan)) {
    return new Response(
      JSON.stringify({ error: "Subscription plan not valid for this feature" }),
      {
        status: 403,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  }

  // 4. Input Parsing
  let input: ClassificationInput;
  try {
    input = (await request.json()) as ClassificationInput;
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  // 5. GenAI Setup
  if (!env.GOOGLE_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Service misconfigured (Missing API Key)" }),
      {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  }

  const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  let prompt = "";
  let contextData = {};

  if (input.type === "app") {
    prompt = env.PROMPT_DESKTOP || "Classify this application. Return JSON.";
    contextData = {
      title: input.title,
      bundle_id: input.bundle_id,
      app_name: input.app_name,
    };
  } else if (input.type === "website" || (input as any).url) {
    // Treat as website if url is present
    const url = (input as any).url || (input as WebsiteInput).url;

    // Fetch metadata with 200ms timeout
    const metadata = await fetchWebsiteMetadata(url);

    prompt = env.PROMPT_WEBSITE || "Classify this website. Return JSON.";
    contextData = {
      url: url,
      ...metadata,
    };
  } else {
    return new Response(JSON.stringify({ error: "Unknown input type" }), {
      status: 400,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  // 6. Check cache before calling LLM
  const cacheKey = await generateCacheKey(prompt, contextData);
  
  try {
    const cachedResult = await env.CLASSIFICATION_CACHE.get(cacheKey);
    if (cachedResult) {
      // Return cached result
      return new Response(JSON.stringify({ result: cachedResult, cached: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    // Cache read error - continue to LLM call
    console.error("Cache read error:", e);
  }

  // 7. Generate with LLM (cache miss)
  try {
    const result = await model.generateContent({
      systemInstruction: prompt,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify(contextData),
            },
          ],
        },
      ],
    });

    // remove ````json` markers if present
    let text = result.response.text();
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 8. Store result in cache (non-blocking, ignore errors)
    try {
      await env.CLASSIFICATION_CACHE.put(cacheKey, text, {
        expirationTtl: CACHE_TTL_SECONDS,
      });
    } catch (e) {
      console.error("Cache write error:", e);
    }

    // Return JSON
    return new Response(JSON.stringify({ result: text, cached: false }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("GenAI Error:", e);
    return new Response(JSON.stringify({ error: "AI Service Error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
