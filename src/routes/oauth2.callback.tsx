import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

type OAuth2CallbackSearch = {
    code?: string;
    state?: string;
    error?: string;
    error_description?: string;
};

export const Route = createFileRoute("/oauth2/callback")({
    validateSearch: (search: Record<string, unknown>): OAuth2CallbackSearch => ({
        code: search.code as string | undefined,
        state: search.state as string | undefined,
        error: search.error as string | undefined,
        error_description: search.error_description as string | undefined,
    }),
    component: OAuth2CallbackPage,
});

function OAuth2CallbackPage() {
    const { code, state, error, error_description } = useSearch({
        from: "/oauth2/callback",
    });

    useEffect(() => {
        // Construct the deeplink URL
        const params = new URLSearchParams();

        if (error) {
            params.set("error", error);
            if (error_description) {
                params.set("error_description", error_description);
            }
        } else if (code) {
            params.set("code", code);
        }

        if (state) {
            params.set("state", state);
        }

        const deeplink = `focusd://oauth2/callback?${params.toString()}`;

        // Redirect to the deeplink
        window.location.href = deeplink;
    }, [code, state, error, error_description]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4">
            <div className="text-center space-y-4">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <h1 className="text-xl font-semibold text-foreground">
                    Redirecting to Focusd...
                </h1>
                <p className="text-muted-foreground">
                    If you're not redirected automatically,{" "}
                    <a
                        href={`focusd://oauth2/callback?${new URLSearchParams({
                            ...(code && { code }),
                            ...(state && { state }),
                            ...(error && { error }),
                            ...(error_description && { error_description }),
                        }).toString()}`}
                        className="text-primary hover:underline"
                    >
                        click here
                    </a>
                </p>
            </div>
        </div>
    );
}
