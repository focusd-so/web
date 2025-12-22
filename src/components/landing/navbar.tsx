import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4",
                className
            )}
        >
            <nav className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
                <div className="flex h-14 items-center justify-between px-6">
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src="/logo_dark.png"
                            alt="Focusd"
                            className="h-8 w-auto"
                        />
                    </a>
                    <div className="flex items-center gap-4">
                        <a
                            href="#waitlist"
                            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                        >
                            Join waitlist
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
