import { Badge } from "@/components/ui/badge";
import { Shield, Clock, BellOff, Focus } from "lucide-react";

export function FocusSessionsSection() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-neutral-950 -z-10" />

            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Content */}
                    <div className="space-y-8">
                        <Badge
                            variant="outline"
                            className="px-3 py-1 text-xs font-medium border-purple-500/30 text-purple-400 bg-purple-500/10"
                        >
                            Core feature
                        </Badge>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Focus Sessions
                            </h2>
                            <p className="text-lg text-white/60 leading-relaxed">
                                Not just time tracking. Active protection for your attention.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Interruption shield
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Non-urgent notifications are queued. Your focus stays intact.
                                        Important alerts still get through.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <Clock className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Time-boxed deep work
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Set explicit boundaries. Know exactly when you'll surface.
                                        Work without guilt.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 mt-1">
                                    <BellOff className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Deferred, not ignored
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Everything queued gets surfaced when your session ends.
                                        Nothing falls through the cracks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-2xl opacity-60" />

                        {/* Session card mock */}
                        <div className="relative bg-neutral-900/80 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="space-y-5">
                                {/* Session header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-4 h-4 rounded-full bg-green-500" />
                                            <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 animate-ping opacity-50" />
                                        </div>
                                        <span className="text-base font-semibold text-white">Deep Work</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Focus className="w-4 h-4 text-white/40" />
                                        <span className="text-sm font-medium text-white/60">1:47:23</span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-2">
                                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                        <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                                    </div>
                                    <div className="flex justify-between text-xs text-white/40">
                                        <span>Started 1h 47m ago</span>
                                        <span>33m remaining</span>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/10" />

                                {/* Deferred items */}
                                <div className="space-y-3">
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                        Deferred during session
                                    </p>

                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                                        <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-orange-400">SL</span>
                                        </div>
                                        <span className="text-sm text-white/60">4 Slack messages</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                                        <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-blue-400">EM</span>
                                        </div>
                                        <span className="text-sm text-white/60">2 emails (non-urgent)</span>
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
