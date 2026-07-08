"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Sparkles, Command, HelpCircle } from "lucide-react";
import { BulgeText } from "@/components/bulge-text";

const RESPONSES = {
    help: "I can help you navigate Oasif's profile. Try asking about: **Whoami**, **Skills**, **Projects**, or **Contact**.",
    whoami: "Oasif Ahmed Rikto is a Full Stack Developer from Bangladesh. He specializes in building secure, scalable web systems and is obsessed with understanding how things work under the hood.",
    skills: "Oasif's tech stack includes **Next.js, React, TypeScript, Node.js, and MongoDB**. He's also proficient in **C++** and has a strong focus on **System Security (JWT/OIDC)** and **AI-driven development**.",
    projects: "He has built complex marketplaces like **Local Chef Bazaar** and high-performance developer tools. You can find his full showcase by scrolling down to the 'Recent Projects' section!",
    contact: "You can reach Oasif at **oasifrikto@gmail.com** or find him on **GitHub** and **LinkedIn**. He's always open to new opportunities and collaborations.",
    security: "Oasif follows 'Security by Design' principles. He implements robust auth systems, secure API routing, and is currently mastering AI-enhanced security audits.",
    clear: "",
};

export function InteractiveTerminal() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        { role: "assistant", content: "Hello! I'm Oasif's AI assistant. How can I help you today?" }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const msg = input.trim().toLowerCase();
        if (!msg) return;

        // Add user message
        const newMessages = [...messages, { role: "user" as const, content: input }];
        setMessages(newMessages);
        setInput("");

        // Artificial delay for "AI thinking"
        setTimeout(() => {
            let response = "";
            if (msg === "clear") {
                setMessages([]);
                return;
            } else if (msg in RESPONSES) {
                response = RESPONSES[msg as keyof typeof RESPONSES];
            } else {
                response = "I'm not sure about that. Try typing 'help' to see what I can tell you about Oasif!";
            }
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        }, 600);
    };

    return (
        <div className="w-full relative">
            <div 
                className="rounded-3xl border border-white/10 bg-transparent backdrop-blur-[2px] shadow-2xl overflow-hidden font-sans flex flex-col h-[350px] transition-all duration-500 hover:border-white/20"
            >
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-wider uppercase">Rikto AI</h3>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[10px] text-muted tracking-tighter uppercase font-medium">Online</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMessages([{ role: "assistant", content: "Messages cleared. How can I help you?" }])}
                        className="p-2 rounded-lg hover:bg-white/5 text-muted transition-colors"
                        title="Clear Chat"
                    >
                        <Command size={14} />
                    </button>
                </div>

                {/* Messages Area */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 scrollbar-hide flex flex-col gap-6"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    msg.role === "user" ? "bg-foreground/20" : "bg-foreground/5 border border-white/5"
                                }`}>
                                    {msg.role === "user" ? <User size={14} /> : <Sparkles size={14} className="text-foreground/40" />}
                                </div>
                                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === "user" 
                                    ? "bg-foreground text-background font-medium rounded-tr-none" 
                                    : "bg-white/[0.03] border border-white/5 text-foreground/80 rounded-tl-none"
                                }`}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5">
                    <form 
                        onSubmit={handleSend}
                        className="relative flex items-center gap-2"
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-5 pr-12 text-sm text-foreground placeholder:text-muted/30 focus:outline-none focus:border-foreground/20 transition-all"
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 p-2 rounded-xl bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    
                    {/* Suggestion Pills */}
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {['Whoami', 'Skills', 'Projects'].map((s) => (
                            <button
                                key={s}
                                onClick={() => {
                                    setInput(s);
                                    // Small timeout to allow state update before send
                                    setTimeout(() => handleSend(), 10);
                                }}
                                className="px-3 py-1 rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground hover:bg-white/5 transition-all"
                            >
                                <BulgeText text={s} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
