"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function DotBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const dotSpacing = 44;
        const dotRadius = 1.5;
        const mouseRadius = 150;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            let dotBaseColor = "0, 0, 0";
            if (resolvedTheme === "dark") dotBaseColor = "255, 255, 255";
            if (resolvedTheme === "cream") dotBaseColor = "58, 50, 44";

            const isDark = resolvedTheme === "dark";

            const cols = Math.ceil(width / dotSpacing);
            const rows = Math.ceil(height / dotSpacing);

            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    const x = i * dotSpacing;
                    const y = j * dotSpacing;

                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    let currentRadius = dotRadius;
                    let opacity = isDark ? 0.15 : 0.1;

                    if (distance < mouseRadius) {
                        const factor = 1 - distance / mouseRadius;
                        currentRadius = dotRadius + factor * 2;
                        opacity = (isDark ? 0.15 : 0.1) + factor * 0.4;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${dotBaseColor}, ${opacity})`;
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [resolvedTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none opacity-80"
            style={{ background: "transparent" }}
        />
    );
}
