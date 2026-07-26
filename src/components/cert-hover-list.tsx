"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import gsap from "gsap";

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
}

interface CertHoverListProps {
  certificates: Certificate[];
}

const MotionImage = motion.create(Image);

export function CertHoverList({ certificates }: CertHoverListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const floating = floatingRef.current;
    if (!container || !floating || window.innerWidth < 1024) return;

    gsap.set(floating, { scale: 0.8, opacity: 0, xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        gsap.to(floating, { opacity: 0, scale: 0.8, duration: 0.35, ease: "power2.out" });
        return;
      }

      const dx = e.clientX - mouseRef.current.lastX;
      mouseRef.current.lastX = e.clientX;
      const rotation = gsap.utils.clamp(-12, 12, dx * 0.15);

      gsap.to(floating, {
        x: e.clientX,
        y: e.clientY,
        rotation,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(floating, { opacity: 0, scale: 0.8, duration: 0.35, ease: "power2.out" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hoveredIndex]);

  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 py-12" ref={containerRef}>
      {/* Floating Image Preview */}
      <div
        ref={floatingRef}
        className="fixed top-0 left-0 w-[420px] h-[260px] pointer-events-none z-[60] overflow-hidden rounded-2xl border border-border/40 bg-surface shadow-[0_30px_70px_-15px_rgba(0,0,0,0.6)] hidden lg:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <AnimatePresence mode="wait">
          {hoveredIndex !== null && certificates[hoveredIndex]?.image ? (
            <MotionImage
              key={certificates[hoveredIndex].title}
              src={certificates[hoveredIndex].image}
              alt="Certificate preview"
              fill
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-foreground/[0.03] flex items-center justify-center">
              <span className="text-sm font-mono text-muted/30">NO IMAGE Available</span>
            </div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="w-24 h-24 rounded-full bg-background/95 backdrop-blur-md border border-border/60 flex flex-col items-center justify-center shadow-2xl scale-95 animate-pulse">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">View</span>
            <span className="text-[9px] font-bold text-muted/60 mt-0.5">Certificate</span>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex flex-col border-t border-border/30">
        {certificates.map((cert, index) => {
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;
          const displayIndex = (index + 1).toString().padStart(2, "0");

          return (
            <div
              key={cert.title + index}
              onClick={() => {
                setModalCert(cert);
                setIsModalOpen(true);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group flex flex-col md:flex-row md:items-center justify-between py-10 md:py-14 border-b border-border/30 cursor-pointer transition-opacity duration-300 ${
                isAnyHovered && !isHovered ? "opacity-30" : "opacity-100"
              }`}
            >
              {/* Left: Index & Title */}
              <div className="flex items-center gap-6 md:gap-10 flex-1">
                <span className="text-sm md:text-base font-mono opacity-50 text-muted group-hover:text-foreground transition-colors">
                  {displayIndex}
                </span>
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground transition-transform duration-500 group-hover:translate-x-4">
                  {cert.title}
                </h3>
              </div>

              {/* Center: Issuer & Date */}
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:px-8 max-w-sm transition-transform duration-500 group-hover:translate-x-4">
                <span className="px-2.5 py-1 rounded-md bg-foreground/5 border border-border text-[9px] uppercase font-bold tracking-widest text-muted/80">
                  {cert.issuer}
                </span>
                {cert.date && (
                  <span className="px-2.5 py-1 rounded-md bg-foreground/5 border border-border text-[9px] uppercase font-bold tracking-widest text-muted/80">
                    {cert.date}
                  </span>
                )}
              </div>

              {/* Right: View Link */}
              <div className="flex items-center justify-between md:justify-end gap-6 mt-6 md:mt-0">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-semibold tracking-wider uppercase text-muted group-hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    View Credential
                    <ArrowUpRight size={18} className="transform group-hover:rotate-45 transition-transform duration-300" />
                  </a>
                ) : (
                  <span className="text-sm font-semibold tracking-wider uppercase text-muted group-hover:text-foreground transition-colors flex items-center gap-2">
                    View Certificate
                    <ArrowUpRight size={18} className="transform group-hover:rotate-45 transition-transform duration-300" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {mounted &&
        modalCert &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
              >
                <motion.div
                  initial={{ backdropFilter: "blur(0px)" }}
                  animate={{ backdropFilter: "blur(8px)" }}
                  exit={{ backdropFilter: "blur(0px)" }}
                  className="absolute inset-0 bg-background/60"
                  onClick={() => setIsModalOpen(false)}
                />

                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="glass-card w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl relative z-50 flex flex-col border border-border/50 shadow-2xl scrollbar-hide cursor-default"
                  data-lenis-prevent
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="sticky top-0 z-30 px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5 grayscale">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                      </div>
                      <h2 className="text-lg font-bold tracking-tight">{modalCert.title}</h2>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-xl hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-6 md:p-10 flex flex-col gap-10">
                    {/* Certificate Image */}
                    <div className="w-full aspect-video rounded-2xl bg-surface border border-border relative overflow-hidden shadow-lg">
                      {modalCert.image ? (
                        <Image
                          src={modalCert.image}
                          alt={modalCert.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl font-black text-foreground/5 select-none">
                            {modalCert.title.split(" ")[0]}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-[10px] uppercase font-bold tracking-widest text-muted/80">
                          {modalCert.issuer}
                        </span>
                        {modalCert.date && (
                          <span className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-[10px] uppercase font-bold tracking-widest text-muted/80">
                            {modalCert.date}
                          </span>
                        )}
                      </div>

                      <h3 className="text-3xl font-bold mb-6 tracking-tight">{modalCert.title}</h3>

                      {modalCert.credentialUrl && (
                        <div className="flex items-center gap-4 pt-6 border-t border-border mt-auto">
                          <a
                            href={modalCert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl flex items-center justify-center gap-2"
                          >
                            View Credential <ExternalLink size={18} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
