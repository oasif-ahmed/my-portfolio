"use client";

import React, { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { GsapReveal } from "./gsap-reveal";
import {
    SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs,
    SiExpress, SiMongodb, SiPostgresql, SiTailwindcss,
    SiDocker, SiFigma, SiPython, SiFirebase, SiJsonwebtokens,
    SiGit, SiHtml5, SiCss3, SiCplusplus, SiFramer, SiVite
} from "react-icons/si";
import { IconType } from "react-icons";

interface Skill {
    name: string;
    icon: IconType;
    level: number;
}

const skills: Skill[] = [
    // Row 0 — 4 icons
    { name: "HTML5", icon: SiHtml5, level: 95 },
    { name: "CSS3", icon: SiCss3, level: 90 },
    { name: "JavaScript", icon: SiJavascript, level: 85 },
    { name: "TypeScript", icon: SiTypescript, level: 80 },
    // Row 1 — 5 icons
    { name: "React", icon: SiReact, level: 90 },
    { name: "Next.js", icon: SiNextdotjs, level: 85 },
    { name: "Tailwind CSS", icon: SiTailwindcss, level: 95 },
    { name: "Framer Motion", icon: SiFramer, level: 75 },
    { name: "Vite", icon: SiVite, level: 80 },
    // Row 2 — 6 icons (widest)
    { name: "Node.js", icon: SiNodedotjs, level: 75 },
    { name: "Express", icon: SiExpress, level: 80 },
    { name: "MongoDB", icon: SiMongodb, level: 70 },
    { name: "PostgreSQL", icon: SiPostgresql, level: 65 },
    { name: "Firebase", icon: SiFirebase, level: 75 },
    { name: "JWT", icon: SiJsonwebtokens, level: 90 },
    // Row 3 — 5 icons
    { name: "Python", icon: SiPython, level: 80 },
    { name: "C++", icon: SiCplusplus, level: 70 },
    { name: "Docker", icon: SiDocker, level: 60 },
    { name: "Git", icon: SiGit, level: 85 },
    { name: "Figma", icon: SiFigma, level: 70 },
];

// ─── Apple Watch Diamond Honeycomb ─────────────────────────────────
// Widest in the middle, tapers at top and bottom → fills horizontal space
const HONEYCOMB_ROWS = [4, 5, 6, 5];

// ─── Fisheye Config ────────────────────────────────────────────────
const INFLUENCE_RADIUS = 200;
const MAX_SCALE = 1.65;
const SHRINK_SCALE = 0.88;
const PUSH_STRENGTH = 15;

function computeHoneycombPositions() {
    const positions: { unitX: number; unitY: number }[] = [];
    const totalRows = HONEYCOMB_ROWS.length;

    HONEYCOMB_ROWS.forEach((count, rowIdx) => {
        for (let col = 0; col < count; col++) {
            positions.push({
                unitX: col - (count - 1) / 2,
                unitY: rowIdx - (totalRows - 1) / 2,
            });
        }
    });

    return positions;
}

const GRID_POSITIONS = computeHoneycombPositions();

export function SkillsGrid() {
    const positionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const animateRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const [dims, setDims] = useState({ cellW: 108, cellH: 95, iconSize: 84 });

    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 640) {
                setDims({ cellW: 72, cellH: 65, iconSize: 56 });
            } else if (window.innerWidth < 768) {
                setDims({ cellW: 88, cellH: 78, iconSize: 68 });
            } else {
                setDims({ cellW: 108, cellH: 95, iconSize: 84 });
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const containerHeight = useMemo(() => {
        const maxRowIdx = (HONEYCOMB_ROWS.length - 1) / 2;
        return Math.ceil(maxRowIdx * 2 * dims.cellH + dims.iconSize + 80);
    }, [dims]);

    // ─── Fisheye engine ────────────────────────────────────────────
    const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
        if (!point) return;
        const mx = point.clientX;
        const my = point.clientY;

        positionRefs.current.forEach((posEl, i) => {
            const animEl = animateRefs.current[i];
            if (!posEl || !animEl) return;

            const rect = posEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = mx - cx;
            const dy = my - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetScale: number;
            let targetX = 0;
            let targetY = 0;

            if (dist < INFLUENCE_RADIUS) {
                const ratio = dist / INFLUENCE_RADIUS;
                const intensity = 0.5 + 0.5 * Math.cos(Math.PI * ratio);
                targetScale = 1 + (MAX_SCALE - 1) * intensity;

                if (dist > 2) {
                    const pushForce = intensity * PUSH_STRENGTH;
                    targetX = -(dx / dist) * pushForce;
                    targetY = -(dy / dist) * pushForce;
                }
            } else {
                targetScale = SHRINK_SCALE;
            }

            gsap.to(animEl, {
                scale: targetScale,
                x: targetX,
                y: targetY,
                duration: 0.35,
                ease: "power3.out",
                overwrite: "auto",
            });
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredIdx(null);
        animateRefs.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.4)",
                overwrite: "auto",
            });
        });
    }, []);

    return (
        <section id="skills" className="py-24 px-6 max-w-6xl mx-auto">
            <GsapReveal>
                <div className="flex items-center gap-4 mb-16">
                    <span className="text-2xl opacity-50 font-mono">{">_"}</span>
                    <h2 className="text-3xl font-bold tracking-tight">The Secret Sauce</h2>
                </div>
            </GsapReveal>

            <GsapReveal delay={0.15}>
                <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseLeave}
                    className="relative mx-auto w-full overflow-visible"
                    style={{ height: `${containerHeight}px` }}
                >
                    {/* ── Ambient side glows ── */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-56 h-56 rounded-full bg-foreground/[0.02] blur-[80px] pointer-events-none" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-56 h-56 rounded-full bg-foreground/[0.02] blur-[80px] pointer-events-none" />
                    <div className="absolute left-[8%] top-[20%] w-32 h-32 rounded-full bg-foreground/[0.015] blur-[60px] pointer-events-none" />
                    <div className="absolute right-[8%] bottom-[20%] w-32 h-32 rounded-full bg-foreground/[0.015] blur-[60px] pointer-events-none" />

                    {/* ── Decorative ghost dots on sides ── */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={`dot-l-${i}`}
                            className="absolute w-2 h-2 rounded-full bg-foreground/[0.04] pointer-events-none hidden md:block"
                            style={{
                                left: `${4 + i * 3}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                        />
                    ))}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={`dot-r-${i}`}
                            className="absolute w-2 h-2 rounded-full bg-foreground/[0.04] pointer-events-none hidden md:block"
                            style={{
                                right: `${4 + i * 3}%`,
                                top: `${15 + (i % 3) * 25}%`,
                            }}
                        />
                    ))}

                    {/* ── Honeycomb icons ── */}
                    {GRID_POSITIONS.map((pos, i) => {
                        const skill = skills[i];
                        if (!skill) return null;

                        const IconComponent = skill.icon;
                        const isHovered = hoveredIdx === i;

                        const px = pos.unitX * dims.cellW;
                        const py = pos.unitY * dims.cellH;
                        const half = dims.iconSize / 2;

                        return (
                            <div
                                key={skill.name}
                                ref={(el) => { positionRefs.current[i] = el; }}
                                className="absolute"
                                style={{
                                    left: `calc(50% + ${px}px - ${half}px)`,
                                    top: `calc(50% + ${py}px - ${half}px)`,
                                    width: `${dims.iconSize}px`,
                                    height: `${dims.iconSize}px`,
                                }}
                            >
                                <div
                                    ref={(el) => { animateRefs.current[i] = el; }}
                                    onMouseEnter={() => setHoveredIdx(i)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                    className="relative w-full h-full cursor-pointer will-change-transform"
                                    style={{ zIndex: isHovered ? 20 : 1 }}
                                >
                                    <div className="w-full h-full rounded-[20px] sm:rounded-[24px] glass-card border border-border/40 bg-foreground/[0.03] flex items-center justify-center shadow-lg hover:bg-foreground/[0.06] transition-colors duration-300">
                                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 text-muted hover:text-foreground transition-colors duration-300" />
                                    </div>

                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute left-1/2 -translate-x-1/2 -bottom-9 z-50 px-3 py-1.5 rounded-lg bg-background/95 backdrop-blur-md border border-border/50 shadow-xl whitespace-nowrap pointer-events-none"
                                            >
                                                <span className="text-[11px] font-bold tracking-tight text-foreground">
                                                    {skill.name}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </GsapReveal>
        </section>
    );
}
