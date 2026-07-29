"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
}

interface CertStackedCardsProps {
  certificates: Certificate[];
}

export function CertStackedCards({ certificates }: CertStackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0 || !containerRef.current) return;

    // Set initial scale and y position for a stacked depth effect
    cards.forEach((card, i) => {
      if (i > 0) {
        gsap.set(card, { 
          scale: 1 - (i * 0.05), // Each subsequent card is slightly smaller
          y: i * 20, // Pushed slightly down
          opacity: 1 - (i * 0.1) // Slightly faded
        });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${cards.length * 100}%`, // Scroll duration scales with number of cards
        scrub: 1, // Smooth scrubbing
        pin: true, // Pin the container
      }
    });

    cards.forEach((card, i) => {
      // Don't animate the very last card away, it stays as the final view
      if (i === cards.length - 1) return;
      
      // Animate current card up and out
      tl.to(card, {
        y: "-120vh", // Move way up
        rotation: i % 2 === 0 ? -12 : 12, // Randomish rotation out
        opacity: 0,
        ease: "power2.inOut",
      }, i); // Start at time 'i'

      // Simultaneously animate the next card into the primary focus position
      tl.to(cards[i + 1], {
        scale: 1,
        y: 0,
        opacity: 1,
        ease: "power2.inOut",
      }, i);
      
      // If there are cards behind the next card, shift them up a slot in the depth stack
      for (let j = i + 2; j < cards.length; j++) {
         tl.to(cards[j], {
           scale: 1 - ((j - i - 1) * 0.05),
           y: (j - i - 1) * 20,
           opacity: 1 - ((j - i - 1) * 0.1),
           ease: "power2.inOut",
         }, i);
      }
    });

    return () => {
      // Cleanup ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [certificates]);

  if (!certificates || certificates.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full bg-background" style={{ zIndex: 10 }}>
       {/* Pinned full-screen container */}
       <div className="w-full h-screen flex items-center justify-center overflow-hidden">
         
         {certificates.map((cert, index) => (
            <div
              key={cert.title + index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute w-full max-w-5xl mx-auto px-4 lg:px-0"
              style={{
                 // Reverse z-index so the first card is on top
                 zIndex: certificates.length - index,
              }}
            >
              <div 
                className="w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/10 flex flex-col md:flex-row overflow-hidden"
                style={{
                  backgroundColor: "#F4F4F4", // Postcard off-white paper color
                  minHeight: "450px",
                  // Subtle paper noise texture
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
              >
                {/* Left side (Text) */}
                <div className="flex-[2] p-8 md:p-14 flex flex-col justify-between relative z-10 text-black">
                  <div>
                    <h2 
                      className="font-black uppercase tracking-tighter leading-[0.85] text-[#111] break-words"
                      style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
                    >
                      {cert.title}
                    </h2>
                  </div>

                  <div className="mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <p className="text-xl md:text-3xl uppercase tracking-tighter text-[#333] font-medium leading-none max-w-[60%]">
                      {cert.issuer}
                    </p>
                    <p className="text-lg md:text-xl text-black/50 font-medium whitespace-nowrap">
                      {cert.date}
                    </p>
                  </div>
                  
                  {cert.credentialUrl && (
                     <div className="mt-8">
                       <a 
                        href={cert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block border-2 border-black px-6 py-2 text-black font-bold uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors"
                       >
                         View Credential
                       </a>
                     </div>
                  )}
                </div>

                {/* Right side (Stamp & Postmark) */}
                <div className="flex-[1] border-t md:border-t-0 md:border-l-2 border-dashed border-black/20 relative flex flex-col items-center justify-start p-8 md:p-12 min-h-[250px]">
                   {/* Stamp container */}
                   {cert.image && (
                     <div className="relative ml-auto md:ml-0 md:mr-0 w-full flex justify-end md:justify-center">
                       
                       {/* Postmark decorative wavy lines underneath stamp */}
                       <div className="absolute top-1/2 left-0 md:-left-12 -translate-y-12 w-32 h-16 opacity-30 mix-blend-multiply pointer-events-none flex flex-col justify-between py-2">
                         {[...Array(5)].map((_, i) => (
                           <div key={i} className="w-full h-[2px] bg-black rounded-full" />
                         ))}
                       </div>

                       {/* Stamp wrapper simulating serrated edges */}
                       <a 
                         href={cert.credentialUrl || '#'} 
                         target={cert.credentialUrl ? "_blank" : "_self"}
                         className="block relative bg-white p-2.5 shadow-md rotate-3 hover:rotate-0 transition-transform duration-500 z-10"
                       >
                          <div className="relative w-32 h-40 md:w-40 md:h-52 overflow-hidden bg-black/5 border border-black/10">
                            <Image 
                              src={cert.image}
                              alt={cert.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                       </a>
                       
                     </div>
                   )}
                </div>
              </div>
            </div>
         ))}
       </div>
    </div>
  );
}
