"use client";

import React, { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { GsapReveal } from "./gsap-reveal";
import DomeSkills from "./dome-skills";
import { getIcon } from "@/lib/icons";

interface Skill {
    name: string;
    icon: IconType;
    level: number;
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

interface SkillsGridProps {
    initialSkills?: Skill[];
}

export function SkillsGrid({ initialSkills }: SkillsGridProps) {
    const [skills] = useState<Skill[]>(initialSkills ?? defaultSkills);
    const [overlayColor, setOverlayColor] = useState("#000000");

    useEffect(() => {
        const updateColor = () => {
            const bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
            setOverlayColor(bg || '#000000');
        };
        updateColor();
        window.addEventListener('resize', updateColor);
        const observer = new MutationObserver(updateColor);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => {
            window.removeEventListener('resize', updateColor);
            observer.disconnect();
        };
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
                <div className="relative w-full" style={{ height: 'min(600px, 70vh)' }}>
                    <DomeSkills
                        skills={skills}
                        fit={0.45}
                        fitBasis="auto"
                        minRadius={400}
                        maxRadius={800}
                        overlayBlurColor={overlayColor}
                        maxVerticalRotationDeg={5}
                        dragSensitivity={20}
                        segments={35}
                        dragDampening={2}
                    />
                </div>
            </GsapReveal>
        </section>
    );
}
