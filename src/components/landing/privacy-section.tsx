import { Card, CardContent } from "@/components/ui/card";
import { HardDrive, KeyRound, Ban, Cloud } from "lucide-react";

const privacyPoints = [
    {
        icon: HardDrive,
        title: "Local-first by default",
        description:
            "Your data lives on your machine. No cloud required to use core features.",
    },
    {
        icon: KeyRound,
        title: "You own your tokens",
        description:
            "API keys and credentials stay with you. We never have access to your integrations.",
    },
    {
        icon: Ban,
        title: "No training on your data",
        description:
            "Your activity is never used to train models. Period. Not ours, not anyone's.",
    },
    {
        icon: Cloud,
        title: "Cloud is opt-in",
        description:
            "Sync features are optional and transparent. You choose what leaves your device.",
    },
];

export function PrivacySection() {
    return (
        <section className="relative py-24 px-4">
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 -z-10" />

            <div className="max-w-5xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                        Privacy & trust
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Your data stays yours
                    </h2>
                    <p className="text-lg text-white/50 max-w-2xl mx-auto">
                        We're developers too. We know what it means to trust a tool with your
                        work context. Here's how we've built that trust in.
                    </p>
                </div>

                {/* Privacy cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {privacyPoints.map((point) => (
                        <Card
                            key={point.title}
                            className="bg-white/[0.02] border-white/10 hover:border-green-500/30 transition-colors group"
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:bg-green-500/15 transition-colors">
                                        <point.icon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {point.title}
                                        </h3>
                                        <p className="text-white/50 leading-relaxed">
                                            {point.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
