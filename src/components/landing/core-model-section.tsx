import { Card, CardContent } from "@/components/ui/card";
import { Link2, Eye, Target } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Link2,
        title: "Connect",
        description:
            "Link your tools—GitHub, Slack, browser, desktop apps. Focusd integrates where you already work.",
    },
    {
        number: "02",
        icon: Eye,
        title: "Observe",
        description:
            "Focusd classifies activity, understands context, and learns what matters to you. No manual tagging required.",
    },
    {
        number: "03",
        icon: Target,
        title: "Focus",
        description:
            "One feed. One priority at a time. Everything else queued until you're ready.",
    },
];

export function CoreModelSection() {
    return (
        <section id="how-it-works" className="relative py-24 px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 -z-10" />

            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                        How it works
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Simple model, profound impact
                    </h2>
                </div>

                {/* Step cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <Card
                            key={step.title}
                            className="bg-white/[0.03] border-white/10 hover:border-white/20 transition-all hover:translate-y-[-2px]"
                        >
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {/* Step number & icon */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-bold text-white/10">
                                            {step.number}
                                        </span>
                                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                            <step.icon className="w-5 h-5 text-white/60" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-semibold text-white">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-white/50 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Progress indicator */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute right-0 top-1/2 translate-x-[calc(100%+1rem)] -translate-y-1/2">
                                            <div className="w-6 h-px bg-white/20" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
