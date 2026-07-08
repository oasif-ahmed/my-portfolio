"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    duration?: number;
    stagger?: number;
}

export function GsapReveal({
    children,
    className = "",
    delay = 0,
    y = 80,
    duration = 1.3,
}: GsapRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.fromTo(
            el,
            { opacity: 0, y },
            {
                opacity: 1,
                y: 0,
                duration,
                delay,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    end: "bottom 20%",
                    toggleActions: "play none none none",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [delay, y, duration]);

    return (
        <div ref={ref} className={`opacity-0 ${className}`}>
            {children}
        </div>
    );
}

export function GsapStaggerReveal({
    children,
    className = "",
    staggerAmount = 0.08,
}: {
    children: React.ReactNode;
    className?: string;
    staggerAmount?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const items = el.children;

        gsap.fromTo(
            items,
            { opacity: 0, y: 40, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                stagger: staggerAmount,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [staggerAmount]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

export function GsapParallax({
    children,
    className = "",
    speed = 0.5,
}: {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.to(el, {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * (speed * 0.1),
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [speed]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
