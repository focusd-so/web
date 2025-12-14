import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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

  const deepLink = useQuery({
    queryKey: ["signup-deep-link", token, token_type],
    queryFn: async () => {
      if (!token) throw new Error("Missing token");
      
      const params = new URLSearchParams();
      params.set("token", token);
      params.set("stytch_token_type", token_type || "oauth");
      
      return `focusd://auth/callback?${params.toString()}`;
    },
    enabled: !!token,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Preparing redirect...</p>
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
