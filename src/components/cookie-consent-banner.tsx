type Props = {
  onAccept: () => void;
  onReject: () => void;
};

export function CookieConsentBanner({ onAccept, onReject }: Props) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 right-4 z-50 max-w-md rounded-xl border border-white/10 bg-neutral-900/95 px-5 py-4 shadow-2xl backdrop-blur-md"
    >
      <p className="text-sm leading-relaxed text-neutral-400">
        We use cookies for analytics to improve our site.{" "}
        <a
          href="/privacy"
          className="text-neutral-300 underline underline-offset-2 hover:text-white"
        >
          Privacy Policy
        </a>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onReject}
          className="rounded-lg border border-white/10 px-4 py-1.5 text-sm text-neutral-400 transition-colors hover:border-white/20 hover:text-neutral-200"
        >
          Reject
        </button>
        <button
          onClick={onAccept}
          className="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
