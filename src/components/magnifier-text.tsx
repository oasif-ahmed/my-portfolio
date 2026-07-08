"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";

interface MagnifierTextProps {
    text: string;
    className?: string;
    zoom?: number;
    lensRadius?: number;
}

export function MagnifierText({ text, className = "", zoom = 2.2, lensRadius = 60 }: MagnifierTextProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const lensRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleMove = useCallback((e: MouseEvent | React.MouseEvent) => {
        const el = containerRef.current;
        const lens = lensRef.current;
        if (!el || !lens) return;

        const r = el.getBoundingClientRect();
        const cx = "clientX" in e ? e.clientX : 0;
        const cy = "clientY" in e ? e.clientY : 0;

        const relX = cx - r.left;
        const relY = cy - r.top;

        setPos({ x: relX, y: relY });
        setVisible(true);
    }, []);

    const handleLeave = useCallback(() => {
        setVisible(false);
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
        <span
            ref={containerRef}
            className={`relative inline-block cursor-none ${className}`}
            style={{ userSelect: "none" }}
        >
            {text}
            <div
                ref={lensRef}
                className="pointer-events-none absolute z-50"
                style={{
                    width: lensRadius * 2,
                    height: lensRadius * 2,
                    borderRadius: "50%",
                    clipPath: `circle(${lensRadius}px)`,
                    left: pos.x - lensRadius,
                    top: pos.y - lensRadius,
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.15s ease",
                    backdropFilter: "blur(0px)",
                    border: "2px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 0 30px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.05)",
                    overflow: "hidden",
                }}
            >
                <span
                    className="absolute inline-block"
                    style={{
                        left: `-${pos.x * (zoom - 1)}px`,
                        top: `-${pos.y * (zoom - 1)}px`,
                        transform: `scale(${zoom})`,
                        transformOrigin: "0 0",
                        whiteSpace: "nowrap",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        letterSpacing: "inherit",
                        color: "inherit",
                    }}
                >
                    {text}
                </span>
            </div>
        </span>
    );
}
