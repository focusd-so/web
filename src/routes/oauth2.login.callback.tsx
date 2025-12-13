import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/oauth2/login/callback" as any)({
  component: OAuthLoginCallback,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string | undefined) || undefined,
  }),
});

function OAuthLoginCallback() {
  const { token } = Route.useSearch();

  const publicToken = import.meta.env.VITE_STYTCH_PUBLIC_TOKEN as
    | string
    | undefined;
  const stytch = useMemo(() => {
    if (!publicToken) return null;
    try {
      return new StytchUIClient(publicToken);
    } catch {
      return null;
    }
  }, [publicToken]);

  // Deep link URL will be constructed after successful auth with a session_jwt
  // (Minted by passing session_duration_minutes to Stytch's authenticate)

  // 1) Authenticate with Stytch on the web (one-time)
  const authQuery = useQuery({
    queryKey: ["stytch-authenticate", Boolean(stytch), token],
    enabled: Boolean(stytch && token),
    queryFn: async () => {
      if (!stytch || !token) throw new Error("Missing requirements");
      const response = await stytch.oauth.authenticate(token, {
        session_duration_minutes: 300 * 24 * 30, // 300 days
      });
      return response as any;
    },
    retry: false,
    // Prevent refetches that would re-use a one-time token and fail
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Build the deep link after successful auth; include current query params + session creds
  const deepLinkUrl = useMemo(() => {
    if (!authQuery.isSuccess) return null;
    const data = authQuery.data as any;
    const sessionJwt = data?.session_jwt as string | undefined;
    const sessionToken = data?.session_token as string | undefined;
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    if (sessionJwt) params.set("session_jwt", sessionJwt);
    if (sessionToken) params.set("session_token", sessionToken);
    return `focusd://auth/callback?${params.toString()}`;
  }, [authQuery.isSuccess, authQuery.data]);

  // 2) After auth success, attempt to open native app via deep link
  const deepLinkQuery = useQuery({
    queryKey: ["deep-link", deepLinkUrl],
    enabled: Boolean(deepLinkUrl),
    queryFn: async () => {
      try {
        if (deepLinkUrl) {
          window.location.href = deepLinkUrl;
        }
      } finally {
        await new Promise((r) => setTimeout(r, 1500));
      }
    },
    retry: false,
    // Avoid re-triggering deep link on remount/focus
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Render states
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Missing token</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No authentication token was provided.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ready or opening_app fallback view
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">
              {deepLinkQuery.isLoading
                ? "Opening the app..."
                : "Authentication successful"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deepLinkQuery.isLoading ? (
              <p className="text-muted-foreground">
                If you have the Focusd app installed, it should open
                automatically.
              </p>
            ) : (
              <>
                <p className="text-muted-foreground">
                  You can now continue in the Focusd app.
                </p>
                {deepLinkUrl && (
                  <Button
                    onClick={() => (window.location.href = deepLinkUrl)}
                    variant="default"
                    className="w-full"
                  >
                    Open Focusd app
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
