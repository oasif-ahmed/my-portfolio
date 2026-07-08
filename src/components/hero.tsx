"use client";

import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import { BulgeText } from "./bulge-text";
import { MagnifierText } from "./magnifier-text";

export function Hero() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section id="hero" className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3] 
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] -left-[10%] w-[400px] h-[400px] bg-foreground/5 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3] 
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] -right-[10%] w-[400px] h-[400px] bg-foreground/5 rounded-full blur-[120px]" 
                />
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
                {/* 3D Profile Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative mb-10 group cursor-grab active:cursor-grabbing"
                >
                    {/* Shadow that moves opposite to tilt */}
                    <motion.div 
                        style={{
                            x: useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]),
                            y: useTransform(mouseYSpring, [-0.5, 0.5], [20, -20]),
                        }}
                        className="absolute inset-4 bg-black/40 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" 
                    />
                    
                    <div 
                        style={{ transform: "translateZ(50px)" }}
                        className="relative w-32 h-32 md:w-40 md:h-40 overflow-visible transition-transform duration-500 drop-shadow-2xl"
                    >
                        <Image
                            src="/avatar.png"
                            alt="Oasif Ahmed Rikto Avatar"
                            width={160}
                            height={160}
                            className="w-full h-full object-cover rounded-full"
                            priority
                        />
                    </div>

                    {/* Floating Ring */}
                    <div 
                        style={{ transform: "translateZ(30px)" }}
                        className="absolute -inset-4 border border-foreground/10 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    />
                </motion.div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-1.5 rounded-full border border-border bg-surface/50 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Available for Projects
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-1.5 rounded-full border border-border bg-surface/50 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted"
                    >
                        Based in Bangladesh
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
                >
                    Hello, I&apos;m{" "}
                    <span className="text-foreground block mt-2">
                        <MagnifierText text="OASIF AHMED RIKTO." className="cursor-none" zoom={2.5} lensRadius={70} />
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-muted mb-10 h-[1.2em]"
                >
                    <TypeAnimation
                        sequence={[
                            "Full Stack Developer.", 2000,
                            "MERN Stack Developer.", 2000,
                            "Frontend Developer.", 2000,
                            "React.js Developer.", 2000,
                            "JavaScript Developer.", 2000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl text-lg md:text-xl text-muted mb-12 leading-relaxed"
                >
                    I build <span className="text-foreground font-medium">accessible, pixel-perfect</span>, and{" "}
                    <span className="text-foreground font-medium">scalable web apps</span>. Specializing in
                    React, Next.js, and modern UI/UX architecture.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-5"
                >
                    <motion.a
                        href="https://www.linkedin.com/in/oasif-ahmed-rikto-30610b354/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="px-8 py-4 rounded-full bg-foreground text-background font-bold text-base flex items-center gap-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] transition-all shadow-xl"
                    >
                        <BulgeText text="Connect now" /> <ArrowUpRight size={20} />
                    </motion.a>
                    <motion.a
                        href="https://github.com/oasif-ahmed"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="px-8 py-4 rounded-full glass font-bold text-base flex items-center gap-2 hover:bg-foreground/5 transition-all"
                    >
                        <Github size={20} /> <BulgeText text="GitHub" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
