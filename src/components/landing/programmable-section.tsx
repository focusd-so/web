import { Badge } from "@/components/ui/badge";
import { Code2, Terminal, Settings2, Sparkles, Binary } from "lucide-react";

export function ProgrammableSection() {
    return (
        <section id="programmable" className="relative py-24 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-neutral-950 -z-10" />

            {/* Subtle glow */}
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Content */}
                    <div className="space-y-8">
                        <Badge
                            variant="outline"
                            className="px-3 py-1 text-xs font-medium border-blue-500/30 text-blue-400 bg-blue-500/10"
                        >
                            <Terminal className="w-3 h-3 mr-2" />
                            Programmable
                        </Badge>

                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Productivity rules.
                                <br />
                                <span className="text-white/70">Written in code.</span>
                            </h2>
                            <p className="text-lg text-white/60 leading-relaxed">
                                Why settle for basic settings? Define your focus boundaries with TypeScript.
                                Full control over how, when, and what gets blocked.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <Code2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Custom classification
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Override default AI decisions with your own logic.
                                        Mark specific domains or activities exactly how you want.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <Binary className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Context-aware blocking
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Use time, location, or session duration to trigger blocks.
                                        "Allow Slack during standup, block after 10 minutes".
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                                    <Settings2 className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">
                                        Infinite flexibility
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        If you can code it, you can enforce it. The ultimate
                                        productivity power tool for developers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual (Code Editor Mockup) */}
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-60" />

                        {/* Editor Mockup */}
                        <div className="relative bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <span className="text-xs text-white/40 ml-2 font-mono">rules.ts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] h-5 border-blue-500/20 text-blue-400 bg-blue-500/5">
                                        TypeScript
                                    </Badge>
                                </div>
                            </div>

                            {/* Code Area */}
                            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto">
                                <pre className="text-white/90">
                                    <code>
                                        {`/**
 * Custom classification logic.
 */
export function classify(ctx: Context): ClassificationDecision | undefined {
  // Allow browsing during standup
  const ukTimeNow = now("GB")
  if (ukTimeNow.getHours() == 10 && ukTimeNow.getMinutes() <= 30) {
    return {
      classification: Classification.None,
      classificationReasoning: "Can browse during standup"
    }
  }

  // Allow WhatsApp for 5m every 20m
  if (ctx.hostname.includes("whatsapp.com")) {
    if (ctx.minutesSinceLastBlock > 20 && ctx.minutesUsed < 5) {
      return {
        classification: Classification.None,
        classificationReasoning: "Catching up with missus"
      }
    }
  }

  return undefined;
}`}
                                    </code>
                                </pre>
                            </div>

                            {/* Footer/Status */}
                            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Live Rule Active</span>
                                    </div>
                                </div>
                                <Sparkles className="w-3 h-3 text-blue-400/50" />
                            </div>
                        </div>

                        {/* Decoration items */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
