"use client";

import React from "react";
import { GsapReveal } from "./gsap-reveal";
import { Coffee, Code, Sparkles, MapPin } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
    return (
        <section id="about" className="py-24 px-6 max-w-5xl mx-auto">
            <GsapReveal>
                <div className="flex items-center gap-4 mb-16">
                    <span className="text-2xl opacity-50 font-mono">{"//"}</span>
                    <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
                </div>
            </GsapReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Photo Column */}
                <div className="lg:col-span-5 relative">
                    <GsapReveal delay={0.1}>
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-card relative group">
                            {/* NOTE: Replace '/profile.jpg' with your actual image path in the public folder */}
                            <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center text-muted flex-col gap-4 text-center p-6 z-0">
                                <Image
                                    src="/profile.jpg"
                                    alt="Oasif Ahmed Rikto"
                                    fill
                                    className="object-cover z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    onError={(e) => {
                                        // Hide image if it fails to load, showing the placeholder text beneath
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-2">[Photo Placeholder]</div>
                                <p className="text-xs">Add a photo named <strong>profile.jpg</strong> to your <code>public</code> folder.</p>
                            </div>
                        </div>
                    </GsapReveal>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                    <GsapReveal delay={0.2}>
                        <h3 className="text-2xl font-bold mb-6 text-foreground">
                            Passionate Full Stack Developer based in Bangladesh.
                        </h3>
                    </GsapReveal>

                    <GsapReveal delay={0.3}>
                        <div className="prose prose-invert text-muted leading-relaxed mb-8">
                            <p>
                                [<strong>Your Programming Journey Here</strong>] E.g., "My coding journey began when I was exploring how things work under the hood of the web. What started as curiosity quickly turned into a passion for building secure and scalable applications. Over the years, I've honed my skills in modern Javascript ecosystems and backend architecture."
                            </p>
                            <p>
                                [<strong>Type of Work You Enjoy Here</strong>] E.g., "I thrive in environments where I can tackle complex logic and design intuitive user interfaces. I love building tools that empower users, focusing heavily on security by design and seamless performance."
                            </p>
                        </div>
                    </GsapReveal>

                    <GsapReveal delay={0.4}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-border">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0 text-foreground">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-foreground">Interests & Hobbies</h4>
                                    <p className="text-xs text-muted leading-relaxed">
                                        [<strong>Your Hobbies Here</strong>] E.g., "When I'm not coding, you'll find me exploring new coffee shops, reading about cybersecurity, or playing football."
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0 text-foreground">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-foreground">Location</h4>
                                    <p className="text-xs text-muted leading-relaxed">
                                        Dhaka, Bangladesh (Open to Remote globally)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GsapReveal>
                </div>
            </div>
        </section>
    );
}
