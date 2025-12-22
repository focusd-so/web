import { Check, X } from "lucide-react";

const builtFor = [
    "Senior engineers who protect their focus",
    "Tech leads juggling code and coordination",
    "Founders who still ship features",
    "Developers who value privacy",
    "Anyone tired of notification chaos",
];

const notFor = [
    "Casual users who want gamification",
    "Managers who need team oversight",
    "People looking for a task manager",
    "Anyone expecting magic without setup",
    "Those who thrive on constant connectivity",
];

export function AudienceSection() {
    return (
        <section className="relative py-24 px-4">
            <div className="absolute inset-0 bg-neutral-950 -z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                        Who it's for
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Intentionally opinionated
                    </h2>
                </div>

                {/* Two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Built for */}
                    <div className="bg-white/[0.02] border border-green-500/20 rounded-2xl p-6 lg:p-8">
                        <h3 className="text-lg font-semibold text-green-400 mb-6">
                            Built for
                        </h3>
                        <ul className="space-y-4">
                            {builtFor.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span className="text-white/70">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Not for */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8">
                        <h3 className="text-lg font-semibold text-white/50 mb-6">
                            Not for
                        </h3>
                        <ul className="space-y-4">
                            {notFor.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <X className="w-3 h-3 text-white/40" />
                                    </div>
                                    <span className="text-white/40">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
