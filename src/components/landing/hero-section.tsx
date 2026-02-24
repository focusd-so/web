import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-sm font-medium border-white/20 text-white/80 bg-white/5"
        >
          Now available for macOS
        </Badge>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
          Focused, m  ore intentional Mac experience.
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Focusd automatically blocks distracting apps and websites, all the time.
          No sessions to start, no willpower needed — just uninterrupted deep work.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            className="bg-white text-neutral-900 hover:bg-white/90 font-semibold px-8 h-12 text-base"
            asChild
          >
            <a href="https://github.com/focusd-so/focusd/releases/latest/download/Focusd.dmg">
              Download for macOS
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
