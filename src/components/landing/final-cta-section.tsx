import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const WAITLIST_URL = "https://forms.gle/w5X3h3rN1fne8jXJ9";

export function FinalCTASection() {
    return (
        <section id="waitlist" className="relative py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 -z-10" />

            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-2xl mx-auto text-center">
                {/* Badge */}
                <Badge
                    variant="outline"
                    className="px-4 py-1.5 text-sm font-medium border-white/20 text-white/80 bg-white/5 mb-8"
                >
                    Early access
                </Badge>

                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                    Ready to reclaim your focus?
                </h2>

                {/* Description */}
                <p className="text-lg text-white/50 mb-10 max-w-lg mx-auto">
                    Join the waitlist for early access. We're rolling out to a small group
                    of developers first.
                </p>

                {/* Waitlist button */}
                <Button
                    size="lg"
                    className="bg-white text-neutral-900 hover:bg-white/90 font-semibold h-12 px-8"
                    onClick={() => window.open(WAITLIST_URL, "_blank")}
                >
                    Join waitlist
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                {/* macOS note */}
                <p className="text-sm text-white/30 mt-6 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                    </svg>
                    macOS first. Other platforms later.
                </p>
            </div>
        </section>
    );
}
