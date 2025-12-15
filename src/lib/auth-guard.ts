import { redirect } from "@tanstack/react-router";

/**
 * Check if the user is authenticated and redirect to login if not.
 * This function can be used in the beforeLoad of any route that requires authentication.
 * 
 * Note: For Clerk, the recommended approach is to use <SignedIn> and <SignedOut> components
 * or the useAuth hook within route components. This guard provides a synchronous check
 * by looking for Clerk's session cookie.
 */
export async function requireAuth(params: {
  location: { pathname: string };
  context?: any;
}) {
  const { location } = params;
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // If no Clerk key is configured, allow access (dev mode)
    return;
  }

  // Check for Clerk session cookie
  // Clerk sets __session cookie when authenticated
  const hasSession = document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("__session="));

  if (!hasSession) {
    // Not authenticated, redirect to login with current path
    throw redirect({
      to: "/login",
      search: {
        redirect: location.pathname,
      },
    });
  }
}
