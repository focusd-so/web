import { Card, CardContent } from "@/components/ui/card";
import { Layers, Bell, Zap } from "lucide-react";

const problems = [
    {
        icon: Layers,
        title: "Fragmented tools",
        description:
            "GitHub, Slack, email, browser tabs, IDE. Your work is scattered across a dozen apps that don't talk to each other.",
    },
    {
        icon: Zap,
        title: "Constant interruptions",
        description:
            "Every notification pulls you out of flow. The cost isn't the 30 seconds—it's the 23 minutes to get back.",
    },
    {
        icon: Bell,
        title: "Notification overload",
        description:
            "Most alerts aren't urgent. But they all feel urgent. Your attention is being drained by noise disguised as signal.",
    },
];

export function ProblemSection() {
    return (
        <section className="relative py-24 px-4">
            <div className="absolute inset-0 bg-neutral-950 -z-10" />

            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                        The problem
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Deep work is under attack
                    </h2>
                </div>

                {/* Problem cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {problems.map((problem) => (
                        <Card
                            key={problem.title}
                            className="bg-white/[0.03] border-white/10 hover:border-white/20 transition-colors"
                        >
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                        <problem.icon className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {problem.title}
                                    </h3>
                                    <p className="text-white/50 leading-relaxed">
                                        {problem.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
