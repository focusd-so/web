import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | null;
      execute: (
        widgetId?: string,
        options?: {
          async?: boolean;
          callback?: (token: string) => void;
          "error-callback"?: (error?: unknown) => void;
        }
      ) => void;
    };
    onTurnstileExpired?: () => void;
    onTurnstileError?: () => void;
  }
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Bind Turnstile callbacks globally to auto-refresh on expiry or error
  if (typeof window !== "undefined") {
    window.onTurnstileExpired = () => {
      window.turnstile?.reset?.();
    };
    window.onTurnstileError = () => {
      window.turnstile?.reset?.();
    };
  }

  // Ensure video plays on Safari
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist");
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const jsonBody = Object.fromEntries(formData.entries());

    try {
      await axios.post("https://waitlist.focusd.work", jsonBody, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsSubmitted(true);
      setEmail(""); // Clear the input
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <nav className="w-full max-w-7xl bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-full shadow-lg">
          <div className="flex h-18 items-center justify-between px-6 md:px-8  user-select-none">
            <div className="flex items-center gap-2">
              <a href="/">
                <img
                  src="/logo_dark.png"
                  alt="Focusd"
                  className="h-10 w-auto"
                />
              </a>
            </div>
            <Button
              onClick={scrollToWaitlist}
              size="sm"
              className="rounded-full"
            >
              Join waitlist
            </Button>
          </div>
        </nav>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-12 pt-32">
        <div className="max-w-7xl w-full space-y-20">
          {/* Coming Soon Badge */}
          <div className="text-center">
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              Coming Soon
            </span>
          </div>

          {/* Hero Section with Video */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-20 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-6 text-left lg:col-span-2">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight text-center">
                Focused, more intentional{" "}
                <span className="text-primary">Mac experience</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                Block distractions, stay focused, do what matters the most.
              </p>
            </div>

            {/* Right: Video */}
            <div className="w-full lg:col-span-3">
              <video
                ref={videoRef}
                className="w-full h-auto rounded-lg shadow-2xl border border-border"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source
                  src="https://assets.focusd.work/vid/focus.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Screen Time Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-20 items-center mt-45 lg:mt-48">
            {/* Left: Video */}
            <div className="w-full lg:col-span-3 flex justify-center">
              <video
                className="w-full max-w-2xl h-auto rounded-lg shadow-2xl border border-border"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source
                  src="https://assets.focusd.work/vid/screentime.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Right: Text */}
            <div className="space-y-6 text-left lg:col-span-2">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight text-center">
                See where your <span className="text-primary">time goes</span>
              </h2>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                Track your screen time and understand your digital habits.
              </p>
            </div>
          </div>

          {/* AI Integration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-20 items-center mt-40 lg:mt-48">
            {/* Left: Text */}
            <div className="space-y-6 text-left lg:col-span-2">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight text-center">
                Connect everything,{" "}
                <span className="text-primary">let AI work for you</span>
              </h2>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                Sync your daily apps and get AI-powered summaries of what matters most—automatically.
              </p>
            </div>

            {/* Right: Video */}
            <div className="w-full lg:col-span-3">
              <video
                className="w-full h-auto rounded-lg shadow-2xl border border-border"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source
                  src="https://assets.focusd.work/vid/github.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-border flex-1 max-w-xs"></div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Join Early
            </span>
            <div className="h-px bg-border flex-1 max-w-xs"></div>
          </div>

          {/* Section Label */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Get Early Access
            </h2>
            <p className="text-muted-foreground">
              Be among the first to experience focused work.
            </p>
          </div>

          {/* Waitlist Form */}
          <div id="waitlist" className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-foreground">
                        Join the waitlist
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Be the first to know when we launch
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 h-11"
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="sm:w-auto w-full h-11"
                        disabled={isLoading}
                      >
                        {isLoading ? "Joining..." : "Join Waitlist"}
                      </Button>
                    </div>

                    <div
                      className="cf-turnstile"
                      data-sitekey="0x4AAAAAAB7Z5BKemzubTcEZ"
                      data-theme={(() => {
                        if (typeof document === "undefined") return "auto";
                        try {
                          const root = document.documentElement;
                          const prefersDark = window.matchMedia(
                            "(prefers-color-scheme: dark)"
                          ).matches;
                          const hasDark = root.classList.contains("dark");
                          const hasLight = root.classList.contains("light");
                          const isDark = hasDark || (!hasLight && prefersDark);
                          return isDark ? "dark" : "light";
                        } catch {
                          return "auto";
                        }
                      })()}
                      data-size="normal"
                      data-callback="onSuccess"
                      data-expired-callback="onTurnstileExpired"
                      data-error-callback="onTurnstileError"
                    ></div>

                    <p className="text-xs text-muted-foreground/60">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                ) : (
                  <div className="text-left">
                    <p className="text-base text-center">
                      <div className="mb-5">
                        <b>
                          ✨ You're officially <em>early</em> ✨
                        </b>
                      </div>
                      <div>
                        Thanks for joining the <strong>Focusd Work</strong>{" "}
                        waitlist.
                      </div>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
