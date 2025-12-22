import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

            <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Badge */}
                <Badge
                    variant="outline"
                    className="px-4 py-1.5 text-sm font-medium border-white/20 text-white/80 bg-white/5"
                >
                    macOS app coming soon
                </Badge>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                    Stay in flow.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                        Ship without distractions.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                    Focusd learns what distracts you and automatically blocks apps and
                    websites that break your flow. No willpower required—just uninterrupted
                    deep work.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        size="lg"
                        className="bg-white text-neutral-900 hover:bg-white/90 font-semibold px-8 h-12 text-base"
                        asChild
                    >
                        <a href="#waitlist">
                            Join the waitlist
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="text-white/70 hover:text-white hover:bg-white/10 font-medium h-12 text-base"
                        asChild
                    >
                        <a href="#how-it-works">
                            <Play className="mr-2 h-4 w-4" />
                            See how it works
                        </a>
                    </Button>
                </div>

                {/* UI Mock */}
                <div className="pt-12 max-w-3xl mx-auto">
                    <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50" />

                        {/* Mock UI Card */}
                        <div className="relative bg-neutral-900/80 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        <span className="text-sm font-medium text-white/80">Focus Session Active</span>
                                    </div>
                                    <span className="text-xs text-white/40">2h 34m remaining</span>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10" />

                                {/* Focus items */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-xs font-bold text-purple-400">GH</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">Review PR #428 — Auth refactor</p>
                                            <p className="text-xs text-white/40">2 comments need response</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-400 bg-purple-500/10">
                                            High
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 opacity-60">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <span className="text-xs font-bold text-blue-400">VS</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">Complete API integration</p>
                                            <p className="text-xs text-white/40">In progress since 10:30am</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                                            Current
                                        </Badge>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 opacity-40">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                            <span className="text-xs font-bold text-orange-400">SL</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">3 messages deferred</p>
                                            <p className="text-xs text-white/40">Will notify after session</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                                            Queued
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
