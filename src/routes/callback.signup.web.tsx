import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { StytchUIClient } from "@stytch/vanilla-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/callback/signup/web")({
  component: CallbackSignupWebPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string | undefined) || undefined,
    token_type: (search.token_type as string | undefined) || undefined,
  }),
});

function CallbackSignupWebPage() {
  const { token, token_type } = Route.useSearch();
  const navigate = useNavigate();

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

  const authQuery = useQuery({
    queryKey: ["stytch-authenticate-web", token, token_type],
    enabled: Boolean(stytch && token && token_type),
    queryFn: async () => {
      if (!stytch || !token) throw new Error("Missing requirements");
      
      const response = await stytch.oauth.authenticate(token, {
        session_duration_minutes: 60, // Standard web session duration
      });
      return response;
    },
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Redirect on success
  useEffect(() => {
    if (authQuery.isSuccess) {
      navigate({ to: "/" });
    }
  }, [authQuery.isSuccess, navigate]);

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
          <CardTitle>Logging in...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please wait while we log you in.</p>
        </CardContent>
      </Card>
    </div>
  );
}

