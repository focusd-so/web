export function Footer() {
    return (
        <footer className="relative py-12 px-4 border-t border-white/5">
            <div className="absolute inset-0 bg-neutral-950 -z-10" />

            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & copyright */}
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo_dark.png"
                            alt="Focusd"
                            className="h-6 w-auto opacity-60"
                        />
                        <span className="text-sm text-white/30">
                            © {new Date().getFullYear()} Focusd. All rights reserved.
                        </span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6">
                        <a
                            href="mailto:hello@focusd.work"
                            className="text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                            Contact
                        </a>
                        <a
                            href="/privacy"
                            className="text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                            Privacy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
