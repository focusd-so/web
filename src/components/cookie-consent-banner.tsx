import { Button } from "@/components/ui/button";

type Props = {
  onAccept: () => void;
  onReject: () => void;
};

export function CookieConsentBanner({ onAccept, onReject }: Props) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-background p-4 shadow-lg"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          We use cookies for analytics to improve our site. By continuing, you
          agree to our use of cookies. See our{" "}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={onReject}>
            Reject
          </Button>
          <Button size="sm" onClick={onAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
