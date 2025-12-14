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

  // Authenticate with Stytch
  const authQuery = useQuery({
    queryKey: ["stytch-authenticate-app", token, token_type],
    enabled: Boolean(stytch && token),
    queryFn: async () => {
      if (!stytch || !token) throw new Error("Missing requirements");
      
      // Depending on token_type, we might need different handling, 
      // but usually oauth.authenticate handles the token returned from OAuth flows.
      // The previous code used stytch.oauth.authenticate(token, ...)
      
      const response = await stytch.oauth.authenticate(token, {
        session_duration_minutes: 300 * 24 * 30, // 300 days
      });
      return response;
    },
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Redirect logic
  const redirectUrl = useMemo(() => {
    if (!authQuery.isSuccess || !authQuery.data) return null;
    
    const data = authQuery.data;
    const sessionJwt = data.session_jwt;
    const sessionToken = data.session_token;
    
    const url = new URL("http://localhost:12000/login/callback");
    if (sessionJwt) url.searchParams.set("session_jwt", sessionJwt);
    if (sessionToken) url.searchParams.set("session_token", sessionToken);
    
    return url.toString();
  }, [authQuery.isSuccess, authQuery.data]);

  const redirectQuery = useQuery({
    queryKey: ["redirect-app", redirectUrl],
    enabled: Boolean(redirectUrl),
    queryFn: async () => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
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

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>
            {redirectQuery.isLoading || authQuery.isLoading
              ? "Authenticating..."
              : "Authentication Successful"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {redirectQuery.isLoading || authQuery.isLoading
              ? "Please wait while we log you in..."
              : "Redirecting you to the app..."}
          </p>
          {redirectUrl && (
            <Button
              onClick={() => (window.location.href = redirectUrl)}
              className="w-full"
            >
              Open App Manually
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

