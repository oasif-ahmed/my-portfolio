"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, Code, Terminal, Briefcase, Mail, User, Plus, Moon, Sun, Download, Database } from "lucide-react";
import { useTheme } from "next-themes";

interface Command {
    id: string;
    name: string;
    icon: React.ReactNode;
    shortcut?: string;
    action: () => void;
    category: string;
}

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { theme, setTheme } = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: Command[] = [
        { id: "home", name: "Go to Home", icon: <Home className="w-4 h-4" />, action: () => scrollToSection("hero"), category: "Navigation" },
        { id: "work", name: "View Projects", icon: <Briefcase className="w-4 h-4" />, action: () => scrollToSection("work"), category: "Navigation" },
        { id: "skills", name: "Check Skills", icon: <Code className="w-4 h-4" />, action: () => scrollToSection("skills"), category: "Navigation" },
        { id: "journey", name: "My Journey", icon: <Terminal className="w-4 h-4" />, action: () => scrollToSection("journey"), category: "Navigation" },
        { id: "about", name: "About Me", icon: <User className="w-4 h-4" />, action: () => scrollToSection("about"), category: "Navigation" },
        { id: "contact", name: "Contact Me", icon: <Mail className="w-4 h-4" />, action: () => scrollToSection("contact"), category: "Navigation" },
        { id: "add", name: "Dashboard", icon: <Plus className="w-4 h-4" />, action: () => window.dispatchEvent(new CustomEvent("trigger-add-project")), category: "Management" },
        { id: "theme", name: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`, icon: theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, action: () => setTheme(theme === "dark" ? "light" : "dark"), category: "System" },
        { id: "db", name: "Database Connectivity Check", icon: <Database className="w-4 h-4" />, action: () => window.dispatchEvent(new CustomEvent("trigger-db-check")), category: "System" },
    ];

    const filteredCommands = commands.filter(cmd => 
        cmd.name.toLowerCase().includes(search.toLowerCase()) || 
        cmd.category.toLowerCase().includes(search.toLowerCase())
    );

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
        if (e.key === "Escape") setIsOpen(false);

        if (isOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            }
            if (e.key === "Enter") {
                e.preventDefault();
                filteredCommands[selectedIndex]?.action();
                setIsOpen(false);
            }
        }
    }, [isOpen, filteredCommands, selectedIndex]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            setSearch("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:pt-32">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-xl glass rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                            <Search className="w-5 h-5 text-muted/50" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted/30 text-sm py-1"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedIndex(0);
                                }}
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-foreground/5 border border-white/5">
                                <span className="text-[10px] text-muted font-bold tracking-widest uppercase">ESC</span>
                            </div>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto p-2 no-scrollbar">
                            {filteredCommands.length > 0 ? (
                                filteredCommands.map((cmd, i) => (
                                    <div
                                        key={cmd.id}
                                        className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                            i === selectedIndex ? "bg-foreground/10" : "hover:bg-foreground/5"
                                        }`}
                                        onMouseEnter={() => setSelectedIndex(i)}
                                        onClick={() => {
                                            cmd.action();
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                                                i === selectedIndex ? "border-white/20 bg-foreground/10" : "border-white/5 bg-foreground/5"
                                            }`}>
                                                {cmd.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold">{cmd.name}</span>
                                                <span className="text-[10px] uppercase tracking-wider text-muted/50">{cmd.category}</span>
                                            </div>
                                        </div>
                                        {i === selectedIndex && (
                                            <div className="px-2 py-0.5 rounded bg-foreground/5 border border-white/10 animate-pulse">
                                                <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">Enter</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                                    <Terminal className="w-10 h-10 mb-4" />
                                    <p className="text-sm">No commands found for &quot;{search}&quot;</p>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-3 border-t border-white/5 bg-foreground/[0.02] flex items-center justify-between text-[10px] text-muted/50 font-medium uppercase tracking-widest">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5"><ArrowUpDownIcon className="w-3 h-3" /> Navigate</span>
                                <span className="flex items-center gap-1.5"><EnterIcon className="w-3 h-3" /> Select</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-foreground/5 border border-white/5">⌘</span>
                                <span className="px-1.5 py-0.5 rounded bg-foreground/5 border border-white/5">K</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function ArrowUpDownIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    )
}

function EnterIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 9l-6 6 6 6"/><path d="M4 15h11a5 5 0 0 0 5-5V4"/></svg>
    )
}
