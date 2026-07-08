"use client";

import React, { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";

interface BulgeTextProps {
    text: string;
    className?: string;
    as?: "span" | "div" | "p" | "a" | "button";
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export function BulgeText({ text, className, as: Tag = "span", ...props }: BulgeTextProps) {
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const containerRef = useRef<HTMLElement>(null);

    const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        const cx = "clientX" in e ? e.clientX : 0;
        const cy = "clientY" in e ? e.clientY : 0;
        const maxDist = 140;
        charRefs.current.forEach((el) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            const ecx = r.left + r.width / 2;
            const ecy = r.top + r.height / 2;
            const dx = cx - ecx;
            const dy = cy - ecy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let s = 1;
            let tx = 0;
            let ty = 0;
            let rot = 0;

            if (dist < maxDist) {
                const ratio = dist / maxDist;
                const intensity = 0.5 + 0.5 * Math.cos(Math.PI * ratio);
                s = 1 + 0.7 * intensity;
                if (dist > 1) {
                    const push = intensity * 14;
                    tx = (dx / dist) * push;
                    ty = (dy / dist) * push;
                }
                rot = (dx / maxDist) * intensity * 10;
            }

            gsap.to(el, {
                scale: s,
                x: tx,
                y: ty,
                rotateZ: rot,
                duration: 0.3,
                ease: "power3.out",
                overwrite: "auto",
            });
        });
    }, []);

    const handleLeave = useCallback(() => {
        charRefs.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                scale: 1, x: 0, y: 0, rotateZ: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
                overwrite: "auto",
            });
        });
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("mousemove", handleMove as any);
        el.addEventListener("mouseleave", handleLeave);
        return () => {
            el.removeEventListener("mousemove", handleMove as any);
            el.removeEventListener("mouseleave", handleLeave);
        };
    }, [handleMove, handleLeave]);

    return (
        <Tag
            ref={containerRef as any}
            className={className}
            {...(props as any)}
            style={{ ...props.style, display: "inline-flex", alignItems: "center", letterSpacing: "-0.03em" }}
        >
            {text.split("").map((ch, i) => (
                <span
                    key={i}
                    ref={(el) => { charRefs.current[i] = el; }}
                    className="inline-block will-change-transform"
                    style={{ lineHeight: 1 }}
                >
                    {ch === " " ? "\u00A0" : ch}
                </span>
            ))}
        </Tag>
    );
}
