import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/checkout/success/$checkoutId")({
    component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
    const { checkoutId } = Route.useParams();
    const [redirectStatus, setRedirectStatus] = useState<
        "idle" | "pending" | "redirecting" | "completed" | "failed"
    >("idle");

    useEffect(() => {
        // Initial delay before first redirect attempt
        setRedirectStatus("pending");
        const initialTimer = setTimeout(() => {
            setRedirectStatus("redirecting");
            const deeplink = `focusd://checkout/success?checkoutId=${checkoutId}`;
            window.location.href = deeplink;
        }, 2000);

        // Fallback for when the redirect fails or app isn't installed
        const failureTimer = setTimeout(() => {
            setRedirectStatus((prev) =>
                prev === "redirecting" ? "failed" : prev
            );
        }, 8000); // 2s initial delay + 6s to wait for redirect

        // Detect if the user successfully left the page (presumably to the app)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setRedirectStatus("completed");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(failureTimer);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [checkoutId]);

    const deeplink = `focusd://checkout/success?checkoutId=${checkoutId}`;

    const handleManualClick = () => {
        setRedirectStatus("completed");
    };

    const isLoaderVisible =
        redirectStatus === "pending" || redirectStatus === "redirecting";

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Thank You Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-foreground">
                        Thank You! 🎉
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Your purchase was successful. We're excited to have you
                        on board!
                    </p>
                    {isLoaderVisible && (
                        <p className="text-sm text-muted-foreground">
                            Redirecting you back to the app...
                        </p>
                    )}
                    {redirectStatus === "failed" && (
                        <p className="text-sm text-yellow-500/80">
                            Couldn't open the app automatically.
                        </p>
                    )}
                </div>

                {/* Loading Spinner */}
                <div className="flex justify-center h-8">
                    {isLoaderVisible && (
                        <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full" />
                    )}
                </div>

                {/* Manual Link */}
                <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                        Not redirected automatically?
                    </p>
                    <a
                        href={deeplink}
                        onClick={handleManualClick}
                        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        Open in Focusd App
                    </a>
                </div>

                {/* Additional Info */}
                <div className="pt-6">
                    <p className="text-xs text-muted-foreground">
                        Order ID: {checkoutId}
                    </p>
                </div>
            </div>
        </div>
    );
}
