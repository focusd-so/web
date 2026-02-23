import { Badge } from "@/components/ui/badge";
import { Ban, Globe, AppWindow, Sparkles } from "lucide-react";

export function DistractionBlockingSection() {
    return (
        <section id="how-it-works" className="relative py-24 px-4 overflow-hidden scroll-mt-24">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 -z-10" />

            {/* Subtle glow */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Visual */}
                    <div className="relative order-2 lg:order-1">
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-2xl opacity-60" />

                        {/* Blocking UI mock */}
                        <div className="relative bg-neutral-900/80 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="space-y-5">
                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                        <Ban className="w-4 h-4 text-red-400" />
                                    </div>
                                    <span className="text-base font-semibold text-white">Smart Blocking Active</span>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10" />

                                {/* Blocked items */}
                                <div className="space-y-3">
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                        Auto-blocked — always on
                                    </p>

                                    {/* Website blocked */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">x.com</p>
                                            <p className="text-xs text-red-400/80">Blocked • Opens after focus session</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-red-500/30 text-red-400 bg-red-500/10">
                                            Website
                                        </Badge>
                                    </div>

                                    {/* App blocked */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <AppWindow className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">Discord</p>
                                            <p className="text-xs text-red-400/80">Blocked • 47 min remaining</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-red-500/30 text-red-400 bg-red-500/10">
                                            App
                                        </Badge>
                                    </div>

                                    {/* Another website */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20 opacity-70">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">reddit.com</p>
                                            <p className="text-xs text-red-400/80">Blocked • Detected as distraction</p>
                                        </div>
                                        <Badge variant="outline" className="text-xs border-red-500/30 text-red-400 bg-red-500/10">
                                            Website
                                        </Badge>
                                    </div>
                                </div>

                                {/* AI learning indicator */}
                                <div className="flex items-center gap-2 pt-2">
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs text-white/40">Learns from your patterns automatically</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-8 order-1 lg:order-2">
                        <Badge
                            variant="outline"
                            className="px-3 py-1 text-xs font-medium border-red-500/30 text-red-400 bg-red-500/10"
                        >
                            Intelligent blocking
                        </Badge>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Distractions blocked.
                                <br />
                                <span className="text-white/70">Automatically.</span>
                            </h2>
                            <p className="text-lg text-white/60 leading-relaxed">
                                Focusd monitors your activity and automatically blocks apps and websites that break your focus — all the time, without you lifting a finger.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Learns your patterns
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        No manual blocklists. Focusd observes when you context-switch
                                        and identifies what's breaking your focus.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <AppWindow className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Apps and websites
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Social media, news sites, messaging apps. If it's hurting
                                        your productivity, it gets blocked during focus time.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <Ban className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Zero willpower required
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        You don't have to resist temptation. The distraction
                                        simply isn't available.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
