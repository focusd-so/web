const CONSENT_KEY = "focusd_cookie_consent";
const CONSENT_EXPIRY_DAYS = 365;

export type ConsentStatus = "accepted" | "rejected" | null;

export function getStoredConsent(): ConsentStatus {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { status, expires } = JSON.parse(raw) as {
      status: ConsentStatus;
      expires: number;
    };
    if (expires && Date.now() > expires) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return status;
  } catch {
    return null;
  }
}

export function setStoredConsent(status: ConsentStatus): void {
  const expires = Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ status, expires }));
}

export function loadGoogleAnalytics(measurementId: string): void {
  if (typeof window === "undefined" || !measurementId) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  (window as unknown as { gtag: (...args: unknown[]) => void }).gtag = function () {
    (window as unknown as { dataLayer: unknown[] }).dataLayer =
      (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push(arguments);
  };

  (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
    "js",
    new Date()
  );
  (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
    "config",
    measurementId,
    { anonymize_ip: true }
  );
}
