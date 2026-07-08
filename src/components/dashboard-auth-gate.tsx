"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DashboardAuthModal({ isOpen, onClose, onSuccess }: Props) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: password.trim() }),
            });
            if (res.ok) {
                onSuccess();
                onClose();
                setPassword("");
            } else {
                setError(true);
                if (inputRef.current) {
                    gsap.fromTo(inputRef.current,
                        { x: 0 },
                        { x: 8, duration: 0.08, repeat: 3, yoyo: true, ease: "power2.inOut", onComplete: () => { gsap.set(inputRef.current, { x: 0 }); } }
                    );
                }
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
                    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-sm"
                    >
                        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-foreground/5 blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-foreground/5 blur-[80px] pointer-events-none" />

                        <form
                            onSubmit={handleSubmit}
                            className="relative glass-card rounded-3xl p-8 border border-border/50 space-y-6"
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>

                            <div className="text-center space-y-3">
                                <div className="w-14 h-14 rounded-2xl bg-foreground/5 mx-auto flex items-center justify-center border border-border/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight">Dashboard Access</h1>
                                    <p className="text-sm text-muted/70 mt-1">Enter the password to manage your portfolio.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    ref={inputRef}
                                    type="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-xl bg-foreground/[0.03] border border-border text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/20 text-sm transition-all"
                                />

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-red-400 text-center"
                                    >
                                        Incorrect password.
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 shadow-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                            Checking
                                        </span>
                                    ) : "Enter"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
