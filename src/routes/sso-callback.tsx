import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
  AuthenticateWithRedirectCallback,
  useAuth,
  useSession,
} from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

// Worker endpoint URL - configure based on environment
const AUTH_WORKER_URL =
  import.meta.env.VITE_AUTH_WORKER_URL || "http://localhost:8787";

export const Route = createFileRoute("/sso-callback")({
  component: SSOCallback,
});

interface SignInTokenResponse {
  ticket: string;
}

function SSOCallback() {
  const search = useSearch({ from: "/sso-callback" }) as { source?: string };
  const isDesktop = search.source === "desktop";
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { session, isLoaded: sessionLoaded } = useSession();

  // Mutation to create sign-in token for desktop app
  const createTokenMutation = useMutation({
    mutationFn: async (): Promise<SignInTokenResponse> => {
      const sessionToken = await getToken();
      if (!sessionToken) {
        throw new Error("No session token available");
      }

      const response = await fetch(`${AUTH_WORKER_URL}/createSignInToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create sign-in token");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to the Electron app with the token
      const encodedToken = encodeURIComponent(data.ticket);
      window.location.href = `focusd://auth/callback?ticket=${encodedToken}`;
    },
    onError: (error) => {
      console.error("Failed to create sign-in token:", error);
    },
  });

  // Handler to trigger the token creation
  const handleDesktopRedirect = useCallback(() => {
    if (!createTokenMutation.isPending && !createTokenMutation.isSuccess) {
      createTokenMutation.mutate();
    }
  }, [createTokenMutation]);

  // Desktop flow: After auth completes (redirected back with source=desktop),
  // get a sign-in token and send it to the Electron app
  if (isDesktop && isLoaded && sessionLoaded && isSignedIn && session) {
    // Trigger token creation on first render when conditions are met
    if (
      !createTokenMutation.isPending &&
      !createTokenMutation.isSuccess &&
      !createTokenMutation.isError
    ) {
      // Use setTimeout to avoid calling mutate during render
      setTimeout(handleDesktopRedirect, 0);
    }

    if (createTokenMutation.isError) {
      return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4">
          <p className="text-red-500">
            Failed to authenticate with Focusd app.
          </p>
          <p className="text-sm text-muted-foreground">
            {createTokenMutation.error?.message}
          </p>
          <button
            onClick={() => createTokenMutation.mutate()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to Focusd app...</p>
      </div>
    );
  }

  // OAuth callback processing - Clerk handles the redirect
  return <AuthenticateWithRedirectCallback />;
}
