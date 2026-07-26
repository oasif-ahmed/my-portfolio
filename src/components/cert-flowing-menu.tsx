'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { GsapReveal } from './gsap-reveal';
import './cert-flowing-menu.css';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
}

interface CertFlowingMenuProps {
  certificates: Certificate[];
  speed?: number;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

function CertMenuItem({
  cert,
  speed,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
}: {
  cert: Certificate;
  speed: number;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo' as const };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.cert-flowing-marquee-part') as HTMLElement | null;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };
    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [cert.title]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.cert-flowing-marquee-part') as HTMLElement | null;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;
      if (animationRef.current) animationRef.current.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };
    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [cert.title, repetitions, speed]);

  const handleMouseEnter = useCallback(
    (ev: React.MouseEvent<HTMLAnchorElement>) => {
      if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);
      gsap
        .timeline({ defaults: animationDefaults })
        .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
        .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const edge = findClosestEdge(x, y, rect.width, rect.height);
      gsap
        .timeline({ defaults: animationDefaults })
        .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
        .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
    },
    [],
  );

  return (
    <div
      className="cert-flowing-item"
      ref={itemRef}
      style={{ borderColor }}
      onMouseLeave={handleMouseLeave}
    >
      <a
        className="cert-flowing-link"
        href={cert.credentialUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        style={{ color: 'var(--foreground)' }}
      >
        <span>{cert.title}</span>
        <span className="cert-flowing-subtitle" style={{ marginLeft: '1vw' }}>
          {cert.issuer}
        </span>
      </a>
      <div className="cert-flowing-marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="cert-flowing-marquee-inner-wrap">
          <div className="cert-flowing-marquee-inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="cert-flowing-marquee-part" key={idx} style={{ color: marqueeTextColor }}>
                <span className="cert-flowing-marquee-text">{cert.title}</span>
                <div
                  className="cert-flowing-marquee-img"
                  style={{ backgroundImage: `url(${cert.image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertFlowingMenu({
  certificates,
  speed = 15,
  bgColor = 'transparent',
  marqueeBgColor = 'var(--foreground)',
  marqueeTextColor = 'var(--background)',
  borderColor = 'var(--border)',
}: CertFlowingMenuProps) {
  if (!certificates.length) return null;

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <GsapReveal>
        <div className="flex items-center gap-4 mb-16">
          <span className="text-2xl opacity-50 font-mono">{"//"}</span>
          <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
        </div>
      </GsapReveal>

      <GsapReveal delay={0.15}>
        <div className="cert-flowing-wrap" style={{ backgroundColor: bgColor }}>
          <div className="cert-flowing-menu">
            {certificates.map((cert, idx) => (
              <CertMenuItem
                key={cert.title + idx}
                cert={cert}
                speed={speed}
                marqueeBgColor={marqueeBgColor}
                marqueeTextColor={marqueeTextColor}
                borderColor={borderColor}
              />
            ))}
          </div>
        </div>
      </GsapReveal>
    </section>
  );
}
