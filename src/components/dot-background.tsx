"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(InertiaPlugin);

interface Dot {
  x: number;
  y: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });
  const { resolvedTheme } = useTheme();

  const dotSpacing = 44;
  const dotRadius = 1.5;
  const proximity = 150;
  const speedTrigger = 100;
  const shockRadius = 250;
  const shockStrength = 5;
  const resistance = 750;
  const returnDuration = 1.5;
  const maxSpeed = 5000;

  const isDark = resolvedTheme === "dark";
  const isCream = resolvedTheme === "cream";

  const activeColor = useMemo(() => {
    if (isDark) return { r: 82, g: 39, b: 255 };
    if (isCream) return { r: 82, g: 39, b: 255 };
    return { r: 82, g: 39, b: 255 };
  }, [isDark, isCream]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const buildGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const cols = Math.floor((width + dotSpacing) / dotSpacing);
      const rows = Math.floor((height + dotSpacing) / dotSpacing);

      const dots: Dot[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          dots.push({
            x: x * dotSpacing + dotSpacing / 2,
            y: y * dotSpacing + dotSpacing / 2,
            xOffset: 0,
            yOffset: 0,
            _inertiaApplied: false,
          });
        }
      }
      dotsRef.current = dots;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let dotBaseColor = "0, 0, 0";
      let baseOpacity = 0.1;
      if (isDark) {
        dotBaseColor = "255, 255, 255";
        baseOpacity = 0.15;
      }
      if (isCream) {
        dotBaseColor = "58, 50, 44";
        baseOpacity = 0.1;
      }

      const { x: px, y: py } = pointerRef.current;
      const proxSq = proximity * proximity;

      for (const dot of dotsRef.current) {
        const ox = dot.x + dot.xOffset;
        const oy = dot.y + dot.yOffset;
        const dx = dot.x - px;
        const dy = dot.y - py;
        const dsq = dx * dx + dy * dy;

        let currentRadius = dotRadius;
        let opacity = baseOpacity;
        let style = `rgba(${dotBaseColor}, ${opacity})`;

        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          currentRadius = dotRadius + t * 2;
          const r = Math.round(0 + (activeColor.r - 0) * t);
          const g = Math.round(0 + (activeColor.g - 0) * t);
          const b = Math.round(0 + (activeColor.b - 0) * t);
          opacity = baseOpacity + t * 0.6;
          style = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }

        ctx.beginPath();
        ctx.arc(ox, oy, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = style;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvas.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.x - pr.x, dot.y - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.x - pr.x + vx * 0.005;
          const pushY = dot.y - pr.y + vy * 0.005;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1, 0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.x - cx, dot.y - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.x - cx) * shockStrength * falloff;
          const pushY = (dot.y - cy) * shockStrength * falloff;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1, 0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    const throttledMove = (() => {
      let lastCall = 0;
      return (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastCall >= 50) {
          lastCall = now;
          onMove(e);
        }
      };
    })();

    buildGrid();
    window.addEventListener("resize", buildGrid);
    window.addEventListener("mousemove", throttledMove, { passive: true });
    window.addEventListener("click", onClick);

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme, isDark, isCream, activeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-80"
      style={{ background: "transparent" }}
    />
  );
}
