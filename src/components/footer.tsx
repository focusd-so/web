import { Link } from "@tanstack/react-router";
import { useAnalytics } from "@/components/analytics-provider";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const analytics = useAnalytics();

  return (
    <footer className="w-full border-t bg-background py-6 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>&copy; {currentYear} Focusd. All rights reserved.</p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          {analytics && (
            <button
              type="button"
              onClick={analytics.showBannerAgain}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Cookie preferences
            </button>
          )}
          <Link
            to="/privacy"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

