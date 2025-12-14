import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/callback/signup/app")({
  component: CallbackSignupAppPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string | undefined) || undefined,
    token_type: (search.token_type as string | undefined) || undefined,
  }),
});

function CallbackSignupAppPage() {
  const { token, token_type } = Route.useSearch();

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

  // Authenticate to get session_token and session_jwt
  const authQuery = useQuery({
    queryKey: ["stytch-authenticate-app", token, token_type],
    enabled: Boolean(stytch && token && token_type),
    queryFn: async () => {
      if (!stytch || !token) throw new Error("Missing requirements");
      
      const response = await stytch.oauth.authenticate(token, {
        session_duration_minutes: 60,
      });
      return response;
    },
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Build deeplink with session tokens
  const deepLink = useQuery({
    queryKey: ["signup-deep-link", authQuery.data],
    queryFn: async () => {
      if (!authQuery.data) throw new Error("Authentication not completed");
      
      const sessionToken = authQuery.data.session_token;
      const sessionJwt = authQuery.data.session_jwt;
      
      if (!sessionToken || !sessionJwt) {
        throw new Error("Missing session tokens from authentication response");
      }
      
      const params = new URLSearchParams();
      params.set("session_token", sessionToken);
      params.set("session_jwt", sessionJwt);
      
      return `focusd://auth/callback?${params.toString()}`;
    },
    enabled: authQuery.isSuccess && !!authQuery.data,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data: deepLinkUrl, isLoading } = deepLink;

  // Best-effort auto-redirect
  useQuery({
    queryKey: ["signup-redirect-app", deepLinkUrl],
    enabled: Boolean(deepLinkUrl),
    queryFn: async () => {
      if (deepLinkUrl) {
        window.location.href = deepLinkUrl;
      }
      return true;
    },
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Missing Token</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No token provided in the URL.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authQuery.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Authentication Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {(authQuery.error as Error).message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authQuery.isLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            {authQuery.isLoading ? "Authenticating..." : "Preparing redirect..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Open Focusd to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Click the button below to open the Focusd app and complete your signup.
          </p>
          {deepLinkUrl && (
            <Button
              onClick={() => (window.location.href = deepLinkUrl)}
              className="w-full"
            >
              Open Focusd
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
