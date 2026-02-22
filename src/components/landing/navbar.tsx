import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export function Navbar({ className }: { className?: string }) {
    const [activeSection, setActiveSection] = useState<string>('hero');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const links = [
        { id: 'hero', label: 'Home' },
        { id: 'how-it-works', label: 'How it works' },
        { id: 'privacy', label: 'Data privacy' },
        { id: 'for-who', label: 'Audience' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const sections = links.map(link => document.getElementById(link.id));

            let current = '';
            // We iterate from bottom to top so the lowest one in viewport wins
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section) {
                    const rect = section.getBoundingClientRect();
                    // If the top of the section is above the middle of the screen
                    // or within the top 200px
                    if (rect.top <= 300) {
                        current = links[i].id;
                        break;
                    }
                }
            }

            // If we're at the very top of the page, set active section to home
            if (window.scrollY < 100) {
                current = 'hero';
            }

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const activeIndex = links.findIndex(link => link.id === activeSection);
        if (activeIndex !== -1 && navRefs.current[activeIndex]) {
            const el = navRefs.current[activeIndex]!;
            setIndicatorStyle({
                left: el.offsetLeft,
                width: el.offsetWidth,
                opacity: 1
            });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [activeSection]);

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
                    <div className="flex items-center gap-2 relative">
                        {/* Moving Pill */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-8 bg-white/10 rounded-full transition-all duration-300 ease-out pointer-events-none"
                            style={{
                                left: `${indicatorStyle.left}px`,
                                width: `${indicatorStyle.width}px`,
                                opacity: indicatorStyle.opacity,
                            }}
                        />

                        {links.map((link, index) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                ref={(el) => { navRefs.current[index] = el; }}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium transition-colors relative z-10",
                                    activeSection === link.id
                                        ? "text-white"
                                        : "text-white/70 hover:text-white"
                                )}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
