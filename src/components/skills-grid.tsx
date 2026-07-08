"use client";

import React, { useRef, useCallback, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { GsapReveal } from "./gsap-reveal";
import { IconType } from "react-icons";
import { getSkills, addSkill } from "@/actions/skills";
import { getIcon, allIcons } from "@/lib/icons";

interface Skill {
    name: string;
    icon: IconType;
    level: number;
}

// ─── Apple Watch Diamond Honeycomb ─────────────────────────────────
// Widest in the middle, tapers at top and bottom → fills horizontal space
// ─── Fisheye Config ────────────────────────────────────────────────
const INFLUENCE_RADIUS = 200;
const MAX_SCALE = 1.65;
const SHRINK_SCALE = 0.88;
const PUSH_STRENGTH = 15;

function computeHoneycombRows(count: number): number[] {
    if (count <= 0) return [];
    if (count <= 4) return [count];
    const rows: number[] = [];
    let remaining = count;
    let current = 4;
    let increasing = true;
    while (remaining > 0) {
        const take = Math.min(current, remaining);
        rows.push(take);
        remaining -= take;
        if (increasing) {
            if (current >= 6) increasing = false;
            else current++;
        } else {
            current--;
            if (current < 3) current = 3;
        }
    }
    return rows;
}

function computeHoneycombPositions(rows: number[]) {
    const positions: { unitX: number; unitY: number }[] = [];
    const totalRows = rows.length;
    rows.forEach((count, rowIdx) => {
        for (let col = 0; col < count; col++) {
            positions.push({
                unitX: col - (count - 1) / 2,
                unitY: rowIdx - (totalRows - 1) / 2,
            });
        }
    });
    return positions;
}

const defaultSkills: Skill[] = [
    { name: "HTML5", icon: getIcon("SiHtml5")!, level: 95 },
    { name: "CSS3", icon: getIcon("SiCss3")!, level: 90 },
    { name: "JavaScript", icon: getIcon("SiJavascript")!, level: 85 },
    { name: "TypeScript", icon: getIcon("SiTypescript")!, level: 80 },
    { name: "React", icon: getIcon("SiReact")!, level: 90 },
    { name: "Next.js", icon: getIcon("SiNextdotjs")!, level: 85 },
    { name: "Tailwind CSS", icon: getIcon("SiTailwindcss")!, level: 95 },
    { name: "Framer Motion", icon: getIcon("SiFramer")!, level: 75 },
    { name: "Vite", icon: getIcon("SiVite")!, level: 80 },
    { name: "Node.js", icon: getIcon("SiNodedotjs")!, level: 75 },
    { name: "Express", icon: getIcon("SiExpress")!, level: 80 },
    { name: "MongoDB", icon: getIcon("SiMongodb")!, level: 70 },
    { name: "PostgreSQL", icon: getIcon("SiPostgresql")!, level: 65 },
    { name: "Firebase", icon: getIcon("SiFirebase")!, level: 75 },
    { name: "JWT", icon: getIcon("SiJsonwebtokens")!, level: 90 },
    { name: "Python", icon: getIcon("SiPython")!, level: 80 },
    { name: "C++", icon: getIcon("SiCplusplus")!, level: 70 },
    { name: "Docker", icon: getIcon("SiDocker")!, level: 60 },
    { name: "Git", icon: getIcon("SiGit")!, level: 85 },
    { name: "Figma", icon: getIcon("SiFigma")!, level: 70 },
];

export function SkillsGrid() {
    const positionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const animateRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [skills, setSkills] = useState<Skill[] | null>(null);

    useEffect(() => {
        const load = async () => {
            const data = await getSkills();
            if (data && data.length > 0) {
                setSkills(data.map((s) => ({
                    name: s.name,
                    icon: getIcon(s.icon) || getIcon("SiReact")!,
                    level: s.level,
                })));
            } else {
                for (const s of defaultSkills) {
                    const iconEntry = Object.entries(allIcons).find(([, v]) => v === s.icon);
                    const iconName = iconEntry ? iconEntry[0] : "SiReact";
                    await addSkill({ name: s.name, icon: iconName, level: s.level });
                }
                setSkills(defaultSkills);
            }
        };
        load();
    }, []);

    const [dims, setDims] = useState({ cellW: 108, cellH: 95, iconSize: 84 });

    const honeycombRows = useMemo(() => computeHoneycombRows(skills?.length ?? 0), [skills]);
    const gridPositions = useMemo(() => computeHoneycombPositions(honeycombRows), [honeycombRows]);

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
        const totalRows = honeycombRows.length;
        const maxRowIdx = (totalRows - 1) / 2;
        return Math.ceil(maxRowIdx * 2 * dims.cellH + dims.iconSize + 80);
    }, [dims, honeycombRows]);

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
                {!skills ? (
                    <div className="flex items-center justify-center py-24 text-muted/40 text-sm">Loading skills...</div>
                ) : (
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
                    {gridPositions.map((pos, i) => {
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
                )}
            </GsapReveal>
        </section>
    );
}
