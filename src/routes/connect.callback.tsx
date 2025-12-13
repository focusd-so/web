import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/connect/callback")({
  beforeLoad: ({ search }) => {
    const code = search.code as string | undefined;
    const state = search.state as string | undefined;

    if (typeof window !== "undefined" && code && state) {
      const params = new URLSearchParams();
      params.set("code", code);
      params.set("state", state);
      const deepLink = `focusd://connect/callback?${params.toString()}`;

      // Best-effort auto-redirect to the native app; UI provides a manual fallback.
      try {
        window.location.href = deepLink;
      } catch {
        // no-op: user can click the button below
      }
    }
  },
  component: ConnectCallback,
  validateSearch: (search: Record<string, unknown>) => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
  }),
});

function ConnectCallback() {
  const { code, state } = Route.useSearch();

  // Build the deep link with code and state parameters
  const deepLinkUrl = useQuery({
    queryKey: ["connect-deep-link", code, state],
    queryFn: async () => {
      if (!code || !state) {
        throw new Error("Missing code or state");
      }

      const params = new URLSearchParams();
      params.set("code", code);
      params.set("state", state);
      
      const deepLink = `focusd://connect/callback?${params.toString()}`;

      // Only return the deep link; do not auto-redirect.
      return deepLink;
    },
    enabled: !!(code && state),
    retry: false,
    // Prevent refetches that would re-trigger the deep link
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { data, isLoading, error } = deepLinkUrl;

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Connecting…</h1>
          <p className="text-muted-foreground">Preparing your connection.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6 space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Connection error</h1>
          <p className="text-sm text-muted-foreground">
            Error processing callback: {error.message}
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>Code:</strong> {code || "Not provided"}
            </p>
            <p>
              <strong>State:</strong> {state || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="text-center max-w-xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Successfully connected
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">
          You have successfully connected. Now it’s time to open the Focusd
          app to continue.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            onClick={() => {
              if (data) {
                window.location.href = data;
              }
            }}
          >
            Open Focusd
          </Button>
        </div>
      </div>
    </div>
  );
}
