import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GsapReveal } from "./gsap-reveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface JourneyItem {
    title: string;
    period: string;
    description: string;
    highlights?: string[];
    icons: React.ElementType[];
}

interface JourneyProps {
    initialData?: JourneyItem[];
}

export function Journey({ initialData }: JourneyProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const [journeyData, setJourneyData] = useState<JourneyItem[]>(initialData ?? []);

    useEffect(() => {
        if (!lineRef.current || !containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top center",
                end: "bottom center",
                scrub: 1,
            },
        });

        tl.fromTo(
            lineRef.current,
            { scaleY: 0 },
            { scaleY: 1, ease: "none", transformOrigin: "top" }
        );

        // Animate each journey item with stagger as you scroll
        gsap.utils.toArray<HTMLElement>('.journey-item').forEach((item, index) => {
            gsap.fromTo(item,
                {
                    y: 50,
                    opacity: 0,
                    scale: 0.9,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%", // Trigger when top of item hits 85% of viewport height
                        toggleActions: "play reverse play reverse", // Play animation when scrolling down, reverse when scrolling up
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section id="journey" ref={containerRef} className="py-24 px-6 max-w-6xl mx-auto overflow-hidden">
            <div className="flex items-center gap-4 mb-24">
                <span className="text-2xl opacity-50 font-mono">{"//"}</span>
                <h2 className="text-3xl font-bold tracking-tight">The Journey</h2>
            </div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                {/* Base Line (Transparent/Muted) */}
                <div className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-foreground/5" />

                {/* Animated Progress Line */}
                <div
                    ref={lineRef}
                    className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-foreground/40 via-foreground/20 to-transparent origin-top"
                />

                <div className="space-y-16 md:space-y-24">
                    {journeyData.map((item, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={index} className="journey-item relative flex items-center justify-between w-full group">
                                {/* Mobile node (hidden on desktop) */}
                                <div className="md:hidden absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-foreground/20 bg-background z-10 flex items-center justify-center transition-colors group-hover:border-foreground/50">
                                    <div className="w-2 h-2 rounded-full bg-foreground/20 group-hover:bg-foreground transition-colors" />
                                </div>

                                {/* Desktop: Alternating Layout */}
                                <div className={`flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                    {/* Content Block */}
                                    <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                                        <GsapReveal delay={index * 0.1}>
                                            <div className="flex flex-col gap-4">
                                                <div className={`flex flex-col sm:flex-row sm:items-center gap-4 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                                    <h3 className="text-2xl font-bold tracking-tight group-hover:text-foreground transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <span className="px-3 py-1 rounded-full bg-foreground/5 dark:bg-foreground/10 border border-border text-[10px] uppercase font-bold tracking-widest text-muted w-fit order-first sm:order-none whitespace-nowrap">
                                                        {item.period}
                                                    </span>
                                                </div>

                                                <p className="text-muted leading-relaxed max-w-3xl ml-0 md:ml-auto md:mr-0 inline-block">
                                                    {item.description}
                                                </p>

                                                {item.highlights && (
                                                    <ul className={`space-y-2 ${isEven ? 'md:items-start' : 'md:items-end'} flex flex-col`}>
                                                        {item.highlights.map((highlight, hIndex) => (
                                                            <li key={hIndex} className={`text-sm text-muted/80 flex items-start gap-3 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-foreground/30 flex-shrink-0" />
                                                                {highlight}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                <div className={`flex flex-wrap gap-4 pt-2 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                                                    {item.icons.map((Icon, iconIndex) => (
                                                        <div
                                                            key={iconIndex}
                                                            className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted/60 hover:text-foreground hover:scale-110 transition-all duration-300"
                                                        >
                                                            <Icon size={20} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </GsapReveal>
                                    </div>

                                    {/* Desktop Node (centered) */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-foreground/20 bg-background z-20 items-center justify-center transition-all duration-500 group-hover:border-foreground group-hover:scale-110">
                                        <div className="w-2.5 h-2.5 rounded-full bg-foreground/20 group-hover:bg-foreground transition-colors animate-pulse" />
                                    </div>

                                    {/* Spacer for the other side */}
                                    <div className="hidden md:block w-[45%]" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
