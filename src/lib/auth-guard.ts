import { redirect } from "@tanstack/react-router";

/**
 * Check if the user is authenticated and redirect to login if not.
 * This function can be used in the beforeLoad of any route that requires authentication.
 */
export async function requireAuth(params: {
  location: { pathname: string };
  context?: any;
}) {
  const { location } = params;
  const stytchPublicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN;

  if (!stytchPublicToken) {
    // If no Stytch token is configured, allow access (dev mode)
    return;
  }

  // Check for session using Stytch
  try {
    const { StytchUIClient } = await import("@stytch/vanilla-js");
    const stytch = new StytchUIClient(stytchPublicToken);
    const session = stytch.session.getSync();

    if (!session) {
      // Not authenticated, redirect to login with web param and current path
      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
          web: "true",
        },
      });
    }
  } catch (error) {
    // If it's already a redirect, rethrow it
    if (error && typeof error === "object" && "location" in error) {
      throw error;
    }
    // For other errors, redirect to login
    throw redirect({
      to: "/login",
      search: {
        redirect: location.pathname,
        web: "true",
      },
    });
  }
}

