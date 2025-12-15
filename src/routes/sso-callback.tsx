import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react";

export const Route = createFileRoute("/sso-callback")({
  component: SSOCallback,
});

function SSOCallback() {
  const search = useSearch({ from: "/sso-callback" }) as { source?: string };
  const isDesktop = search.source === "desktop";
  const { isSignedIn, isLoaded } = useAuth();

  // Desktop flow: After auth completes (redirected back with source=desktop),
  // trigger the deeplink to notify the Electron app
  if (isDesktop && isLoaded && isSignedIn) {
    // Call deeplink to notify the Electron app of successful authentication
    window.location.href = "focusd://auth/callback";
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to Focusd app...</p>
      </div>
    );
  }

  // OAuth callback processing - Clerk handles the redirect
  return <AuthenticateWithRedirectCallback />;
}
