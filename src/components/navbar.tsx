"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

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
    const pathname = usePathname();
    const router = useRouter();

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
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl"
        >
            <nav className="glass rounded-full px-4 py-2 flex items-center justify-between gap-2 overflow-hidden">
                <div
                    className="flex-1 flex items-center justify-start sm:justify-between px-1 relative overflow-x-auto no-scrollbar"
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    {navItems.map((item) => {
                        const isCurrent = (hoveredItem || activeItem) === item.name;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onMouseEnter={() => setHoveredItem(item.name)}
                                onClick={() => setActiveItem(item.name)}
                                className={`text-[10px] sm:text-[11px] font-bold transition-all duration-300 relative px-2.5 sm:px-4 py-2 z-10 tracking-widest uppercase flex-shrink-0 ${isCurrent ? "text-foreground" : "text-muted/80"
                                    }`}
                            >
                                {item.name}
                                {isCurrent && (
                                    <motion.div
                                        layoutId="nav-blob"
                                        className="absolute inset-0 bg-foreground/10 backdrop-blur-md rounded-full -z-10 border border-white/10"
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.6
                                        }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 sm:gap-4 pl-3 sm:pl-6 border-l border-border flex-shrink-0">
                    <button 
                        onClick={() => router.push('/dashboard')}
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
    );
}
