"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollFadeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const text = textRef.current;
    const card = cardRef.current;

    if (!section || !heading || !text || !card) return;

    // Create a GSAP timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%", // starts when the top of the section is 80% down the viewport
        end: "bottom 20%", // ends when the bottom of the section is 20% down the viewport
        toggleActions: "play reverse play reverse", // play on enter, reverse on leave, play on enter back, reverse on leave back
      }
    });

    // Animate heading
    tl.fromTo(
      heading,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power4.out" }
    );

    // Animate text (staggered slightly after heading)
    tl.fromTo(
      text,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4" // overlap with heading animation by 0.4s
    );

    // Animate cards or decorative elements with stagger
    tl.fromTo(
      card.children,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
      "-=0.2"
    );

    // Cleanup: Kill ScrollTrigger instance and timeline on unmount to prevent memory leaks
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] border-t border-border/30 relative overflow-hidden"
    >
      <div className="text-center max-w-3xl mb-12">
        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-muted bg-clip-text text-transparent mb-6"
        >
          Buttery Smooth Scroll-Driven Animations
        </h2>
        <p
          ref={textRef}
          className="text-lg md:text-xl text-muted leading-relaxed"
        >
          This section is animated using GSAP ScrollTrigger, synchronized directly with our Lenis inertial scrolling system. Note how the elements fade, slide, and stagger into place with zero lag.
        </p>
      </div>

      <div
        ref={cardRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6"
      >
        {[
          { title: "Fluid Scrolling", desc: "Lenis intercepts wheel and touch inputs, creating an organic inertial scroll weight." },
          { title: "GSAP Ticker Integration", desc: "By updating Lenis inside GSAP's ticker, scroll positions and animation ticks are locked together." },
          { title: "Zero Layout Leaks", desc: "Every ScrollTrigger is explicitly killed upon component unmount, keeping memory footprints light." }
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl glass-card border border-border/40 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-colors duration-300"
          >
            <div className="text-3xl mb-4 font-mono text-muted/50">0{idx + 1}</div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-sm text-muted/70 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
