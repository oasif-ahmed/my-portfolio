"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { IconType } from "react-icons";
import { GsapReveal, GsapStaggerReveal } from "./gsap-reveal";
import { getIcon } from "@/lib/icons";

interface Skill {
    name: string;
    icon: IconType;
    level: number;
    category?: string;
}

const categoryMap: Record<string, string> = {
    HTML5: "Frontend",
    CSS3: "Frontend",
    JavaScript: "Frontend",
    TypeScript: "Frontend",
    React: "Frontend",
    "Next.js": "Frontend",
    "Tailwind CSS": "Frontend",
    "Framer Motion": "Frontend",
    Vite: "Frontend",
    "Node.js": "Backend",
    Express: "Backend",
    MongoDB: "Backend",
    PostgreSQL: "Backend",
    Firebase: "Backend",
    JWT: "Backend",
    Python: "Backend",
    "C++": "Backend",
    Git: "Tools",
    GitHub: "Tools",
    Docker: "Tools",
    Figma: "Tools",
};

const brandColors: Record<string, string> = {
    HTML5: "#E34F26",
    CSS3: "#1572B6",
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    React: "#61DAFB",
    "Next.js": "#000000",
    "Tailwind CSS": "#06B6D4",
    "Framer Motion": "#BB4BFF",
    Vite: "#646CFF",
    "Node.js": "#339933",
    Express: "#000000",
    MongoDB: "#47A248",
    PostgreSQL: "#4169E1",
    Firebase: "#FFCA28",
    JWT: "#000000",
    Python: "#3776AB",
    "C++": "#00599C",
    Git: "#F05032",
    GitHub: "#FFFFFF",
    Docker: "#2496ED",
    Figma: "#F24E1E",
};

const defaultSkills: Skill[] = [
    { name: "HTML5", icon: getIcon("SiHtml5")!, level: 95, category: "Frontend" },
    { name: "CSS3", icon: getIcon("SiCss3")!, level: 90, category: "Frontend" },
    { name: "JavaScript", icon: getIcon("SiJavascript")!, level: 85, category: "Frontend" },
    { name: "TypeScript", icon: getIcon("SiTypescript")!, level: 80, category: "Frontend" },
    { name: "React", icon: getIcon("SiReact")!, level: 90, category: "Frontend" },
    { name: "Next.js", icon: getIcon("SiNextdotjs")!, level: 85, category: "Frontend" },
    { name: "Tailwind CSS", icon: getIcon("SiTailwindcss")!, level: 95, category: "Frontend" },
    { name: "Framer Motion", icon: getIcon("SiFramer")!, level: 75, category: "Frontend" },
    { name: "Vite", icon: getIcon("SiVite")!, level: 80, category: "Frontend" },
    { name: "Node.js", icon: getIcon("SiNodedotjs")!, level: 75, category: "Backend" },
    { name: "Express", icon: getIcon("SiExpress")!, level: 80, category: "Backend" },
    { name: "MongoDB", icon: getIcon("SiMongodb")!, level: 70, category: "Backend" },
    { name: "PostgreSQL", icon: getIcon("SiPostgresql")!, level: 65, category: "Backend" },
    { name: "Firebase", icon: getIcon("SiFirebase")!, level: 75, category: "Backend" },
    { name: "JWT", icon: getIcon("SiJsonwebtokens")!, level: 90, category: "Backend" },
    { name: "Python", icon: getIcon("SiPython")!, level: 80, category: "Backend" },
    { name: "C++", icon: getIcon("SiCplusplus")!, level: 70, category: "Backend" },
    { name: "Git", icon: getIcon("SiGit")!, level: 85, category: "Tools" },
    { name: "GitHub", icon: getIcon("SiGithub")!, level: 85, category: "Tools" },
    { name: "Docker", icon: getIcon("SiDocker")!, level: 60, category: "Tools" },
    { name: "Figma", icon: getIcon("SiFigma")!, level: 70, category: "Tools" },
];

const categoryOrder = ["Frontend", "Backend", "Tools", "Other"];

interface SkillsGridProps {
    initialSkills?: Skill[];
}

function AppleWatchIcon({
    skill,
    mouseX,
    mouseY,
    isGridHovered,
}: {
    skill: Skill;
    mouseX: React.RefObject<number | null>;
    mouseY: React.RefObject<number | null>;
    isGridHovered: boolean;
}) {
    const iconRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const handleMouseMove = useCallback(() => {
        if (!iconRef.current || mouseX.current === null || mouseY.current === null) return;
        const rect = iconRef.current.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        const dx = mouseX.current - iconCenterX;
        const dy = mouseY.current - iconCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 180;
        const minScale = 0.85;
        const maxScale = 1.45;

        if (distance < maxDistance) {
            const proximity = 1 - distance / maxDistance;
            const newScale = minScale + (maxScale - minScale) * proximity;
            setScale(newScale);
        } else {
            setScale(1);
        }
    }, [mouseX, mouseY]);

    const handleMouseEnter = useCallback(() => {
        if (!iconRef.current || mouseX.current === null || mouseY.current === null) return;
        handleMouseMove();
    }, [handleMouseMove, mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        setScale(1);
    }, []);

    const IconComponent = skill.icon;
    const brandColor = brandColors[skill.name] || "#8227ff";

    return (
        <div className="flex flex-col items-center gap-2 relative" ref={iconRef}>
            <div
                className="relative flex items-center justify-center rounded-[22px] transition-transform duration-200 ease-out cursor-default"
                style={{
                    width: 72,
                    height: 72,
                    transform: `scale(${scale})`,
                    background: isGridHovered
                        ? `linear-gradient(135deg, ${brandColor}15, ${brandColor}08)`
                        : "var(--foreground, #333)05",
                    boxShadow: scale > 1.05 ? `0 8px 32px ${brandColor}30, 0 0 0 1px ${brandColor}20` : "none",
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <IconComponent
                    className="transition-colors duration-300"
                    style={{
                        width: 30,
                        height: 30,
                        color: scale > 1.05 ? brandColor : "var(--muted, #888)",
                    }}
                />
            </div>
            <span className="text-xs font-medium text-muted whitespace-nowrap">
                {skill.name}
            </span>
        </div>
    );
}

export function SkillsGrid({ initialSkills }: SkillsGridProps) {
    const [skills] = useState<Skill[]>(initialSkills ?? defaultSkills);
    const [isGridHovered, setIsGridHovered] = useState(false);
    const mouseX = useRef<number | null>(null);
    const mouseY = useRef<number | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const grouped = useMemo(() => {
        const map = new Map<string, Skill[]>();
        for (const skill of skills) {
            const cat = skill.category || categoryMap[skill.name] || "Other";
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(skill);
        }
        return categoryOrder
            .filter((cat) => map.has(cat))
            .map((cat) => [cat, map.get(cat)!] as const);
    }, [skills]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        mouseX.current = e.clientX;
        mouseY.current = e.clientY;
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsGridHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsGridHovered(false);
        mouseX.current = null;
        mouseY.current = null;
    }, []);

    return (
        <section id="skills" className="py-24 px-6 max-w-6xl mx-auto">
            <GsapReveal>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl opacity-50 font-mono">{">_"}</span>
                    <h2 className="text-3xl font-bold tracking-tight">Stack</h2>
                </div>
                <p className="text-muted mb-16">Technologies & Tools</p>
            </GsapReveal>

            <div className="space-y-16">
                {grouped.map(([category, items]) => (
                    <GsapReveal key={category} delay={0.1}>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted/60 mb-8">
                                {category}
                            </h3>
                            <div
                                ref={gridRef}
                                className="flex flex-wrap justify-start gap-6 lg:gap-8"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {items.map((skill) => (
                                    <AppleWatchIcon
                                        key={skill.name}
                                        skill={skill}
                                        mouseX={mouseX}
                                        mouseY={mouseY}
                                        isGridHovered={isGridHovered}
                                    />
                                ))}
                            </div>
                        </div>
                    </GsapReveal>
                ))}
            </div>
        </section>
    );
}
