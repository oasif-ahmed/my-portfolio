"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { GsapReveal } from "./gsap-reveal";
import { useTheme } from "next-themes";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export function GithubCalendar() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";
    const colorScheme = isDark ? "dark" : "light";

    const calendarTheme = {
        light: resolvedTheme === "cream" 
            ? ["#efeadb", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]
            : ["#f0f0f0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    };

    return (
        <section id="github" className="py-24 px-6 max-w-5xl mx-auto overflow-hidden">
            <GsapReveal>
                <div className="flex items-center gap-4 mb-12">
                    <span className="text-2xl opacity-50 font-mono">{"<git>"}</span>
                    <h2 className="text-3xl font-bold tracking-tight">Code Activity</h2>
                </div>
            </GsapReveal>

            <GsapReveal delay={0.2}>
                <div className="glass-card p-8 md:p-12 rounded-3xl border border-border/50 bg-background/40 backdrop-blur-xl relative overflow-hidden group">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-foreground/5 blur-3xl pointer-events-none group-hover:bg-foreground/10 transition-colors duration-1000"></div>
                    
                    <div className="relative z-10 overflow-x-auto scrollbar-hide min-h-[160px]">
                        {mounted ? (
                            <>
                                <GitHubCalendar 
                                    username="oasif-ahmed" 
                                    blockSize={14}
                                    blockMargin={6}
                                    fontSize={14}
                                    colorScheme={colorScheme}
                                    theme={calendarTheme}
                                    renderBlock={(block, activity) =>
                                        React.cloneElement(block, {
                                            "data-tooltip-id": "react-github-calendar-tooltip",
                                            "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
                                        })
                                    }
                                />
                                <ReactTooltip 
                                    id="react-github-calendar-tooltip" 
                                    noArrow 
                                    style={{ 
                                        backgroundColor: 'var(--foreground)', 
                                        color: 'var(--background)',
                                        fontSize: '12px',
                                        borderRadius: '8px',
                                        padding: '4px 8px',
                                        zIndex: 100
                                    }}
                                />
                            </>
                        ) : (
                            <div className="w-full h-[155px] flex items-center justify-center">
                                <div className="w-full h-full animate-pulse bg-foreground/5 rounded-lg" />
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pt-8 border-t border-border/50">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-foreground/10 flex items-center justify-center text-[10px] font-bold">
                                        GIT
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-muted">
                                Tracking <span className="text-foreground font-semibold">1,000+</span> contributions over the last year
                            </p>
                        </div>
                        
                        <a 
                            href="https://github.com/oasif-ahmed" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-foreground hover:opacity-70 transition-opacity flex items-center gap-2"
                        >
                            Follow on GitHub →
                        </a>
                    </div>
                </div>
            </GsapReveal>
        </section>
    );
}
