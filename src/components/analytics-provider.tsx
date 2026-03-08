import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getStoredConsent,
  setStoredConsent,
  loadGoogleAnalytics,
  type ConsentStatus,
} from "@/lib/analytics";
import { CookieConsentBanner } from "./cookie-consent-banner";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

type ContextValue = {
  consent: ConsentStatus;
  setConsent: (status: ConsentStatus) => void;
  showBannerAgain: () => void;
};

const AnalyticsContext = createContext<ContextValue | null>(null);

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  return ctx;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentStatus>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsentState(getStoredConsent());
    setMounted(true);
  }, []);

  const setConsent = useCallback((status: ConsentStatus) => {
    setConsentState(status);
    setStoredConsent(status);
    if (status === "accepted" && GA_ID) {
      loadGoogleAnalytics(GA_ID);
    }
  }, []);

  const showBannerAgain = useCallback(() => {
    setConsentState(null);
    setStoredConsent(null);
  }, []);

  useEffect(() => {
    if (!mounted || !GA_ID) return;
    const stored = getStoredConsent();
    if (stored === "accepted") {
      loadGoogleAnalytics(GA_ID);
    }
  }, [mounted]);

  const showBanner = mounted && consent === null;
  const handleAccept = useCallback(() => setConsent("accepted"), [setConsent]);
  const handleReject = useCallback(() => setConsent("rejected"), [setConsent]);

  return (
    <AnalyticsContext.Provider value={{ consent, setConsent, showBannerAgain }}>
      {children}
      {showBanner && GA_ID && (
        <CookieConsentBanner onAccept={handleAccept} onReject={handleReject} />
      )}
    </AnalyticsContext.Provider>
  );
}
