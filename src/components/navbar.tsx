"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "./theme-toggle";
import { BulgeText } from "./bulge-text";
import { DashboardAuthModal } from "./dashboard-auth-gate";

const navItems = [
    { name: "Home", href: "#" },
    { name: "Skills", href: "#skills" },
    { name: "Journey", href: "#journey" },
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
];

export function Navbar() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [activeItem, setActiveItem] = useState("Home");
    const [showAuth, setShowAuth] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const lenis = useLenis();

    useEffect(() => { setMounted(true); }, []);

    const scrollTo = (href: string) => {
        if (href === "#") {
            lenis?.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
        } else {
            const target = href.replace("#", "");
            const el = document.getElementById(target);
            if (el && lenis) {
                lenis.scrollTo(el, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) });
            }
        }
    };

    useEffect(() => {
        if (pathname === "/journey") {
            setActiveItem("Journey");
            return;
        }

        const observerOptions = {
            root: null,
            threshold: 0.5,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const item = navItems.find((item) => item.href.endsWith(`#${id}`) || (id === "hero" && item.name === "Home"));
                    if (item) setActiveItem(item.name);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Sections to observe
        const sections = ["hero", "work", "skills", "journey", "about", "contact"];
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [pathname]);

    return (
        <>
            <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
        >
            <nav className="glass rounded-full px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
                <div
                    className="flex-1 flex items-center justify-start sm:justify-between px-1 relative"
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    {navItems.map((item) => {
                        const isCurrent = (hoveredItem || activeItem) === item.name;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onMouseEnter={() => setHoveredItem(item.name)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveItem(item.name);
                                    scrollTo(item.href);
                                }}
                                className={`text-[10px] sm:text-[11px] font-bold transition-all duration-300 relative px-2.5 sm:px-4 py-2 z-10 tracking-widest uppercase flex-shrink-0 ${isCurrent ? "text-foreground" : "text-muted/80"
                                    }`}
                            >
                                <BulgeText text={item.name} />
                                {isCurrent && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute inset-0 rounded-full bg-foreground/10 -z-10"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-6 border-l border-border flex-shrink-0">
                    <button 
                        onClick={() => setShowAuth(true)}
                        className="p-2 rounded-full hover:bg-foreground/5 transition-colors group relative"
                        title="Dashboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/70 group-hover:text-foreground transition-colors"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[9px] sm:text-xs font-medium text-muted uppercase tracking-wider hidden md:inline-block whitespace-nowrap">
                            Available
                        </span>
                    </div>
                    <ThemeToggle />
                </div>
            </nav>
        </motion.header>

            {mounted && createPortal(
                <DashboardAuthModal
                    isOpen={showAuth}
                    onClose={() => setShowAuth(false)}
                    onSuccess={() => router.push('/dashboard')}
                />,
                document.body
            )}
        </>
    );
}
