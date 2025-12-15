import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStytch } from "@stytch/react";

export const Route = createFileRoute("/callback/signup/app")({
  component: CallbackSignupAppPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string | undefined) || undefined,
    stytch_token_type:
      (search.stytch_token_type as string | undefined) || undefined,
  }),
});

function CallbackSignupAppPage() {
  const { token, stytch_token_type } = Route.useSearch();
  const stytch = useStytch();

  // Authenticate to get session_token and session_jwt
  const authQuery = useQuery({
    queryKey: ["stytch-authenticate-app", token, stytch_token_type],
    enabled: Boolean(stytch && token && stytch_token_type),
    queryFn: async () => {
      if (!stytch || !token) throw new Error("Missing requirements");

      try {
        if (stytch_token_type === "oauth") {
          const response = await stytch.oauth.authenticate(token, {
            session_duration_minutes: 60 * 24 * 30 * 5,
          });
          return response;
        }
        if (stytch_token_type === "email_magic_link") {
          const response = await stytch.magicLinks.authenticate(token, {
            session_duration_minutes: 60 * 24 * 30 * 5,
          });
          return response;
        }
      } catch (error) {
        console.error("Error authenticating:", error);
        throw error;
      }
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

  const {
    data: deepLinkUrl,
    isLoading: isDeepLinkLoading,
    isError: isDeepLinkError,
    error: deepLinkError,
  } = deepLink;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Missing Token</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No token provided in the URL.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stytch_token_type) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Missing Token Type</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No stytch_token_type provided in the URL.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stytch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stytch is not properly configured. Please check your environment
              variables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authQuery.isError && authQuery.error) {
    const error = authQuery.error;
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "An unknown authentication error occurred";

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">
              Authentication Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{errorMessage}</p>
            {error instanceof Error && error.stack && (
              <details className="mt-4">
                <summary className="text-sm text-muted-foreground cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isDeepLinkError && deepLinkError) {
    const error = deepLinkError;
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "An unknown error occurred while preparing the redirect";

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Redirect Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{errorMessage}</p>
            {error instanceof Error && error.stack && (
              <details className="mt-4">
                <summary className="text-sm text-muted-foreground cursor-pointer">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authQuery.isLoading || isDeepLinkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            {authQuery.isLoading
              ? "Authenticating..."
              : "Preparing redirect..."}
          </p>
        </div>
      </div>
    );
  }

  // If auth query is not enabled (shouldn't happen due to checks above, but safety check)
  if (!authQuery.isSuccess && !authQuery.isLoading && !authQuery.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Waiting for Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please wait while we authenticate...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debug logging (remove in production if needed)
  if (typeof window !== "undefined") {
    console.log("Callback state:", {
      authQuerySuccess: authQuery.isSuccess,
      authQueryData: authQuery.data ? "present" : "missing",
      deepLinkUrl: deepLinkUrl ? "present" : "missing",
      isDeepLinkLoading,
      isDeepLinkError,
      deepLinkData: deepLink.data,
    });
  }

  // If we have a deeplink URL, show the button
  // If not, show a message (shouldn't happen if auth succeeded)
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Open Focusd to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Click the button below to open the Focusd app and complete your
            signup.
          </p>
          {deepLinkUrl ? (
            <Button
              onClick={() => {
                console.log("Opening deeplink:", deepLinkUrl);
                window.location.href = deepLinkUrl;
              }}
              className="w-full"
            >
              Open Focusd
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              {authQuery.isSuccess
                ? "Preparing redirect link..."
                : "Waiting for authentication..."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
