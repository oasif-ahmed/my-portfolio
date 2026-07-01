"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

function SmoothScrollInner({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // 1. Sync Lenis scroll with GSAP ScrollTrigger updates
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // 2. Add Lenis RAF to GSAP Ticker for synchronized render loop
    // GSAP's ticker runs in a requestAnimationFrame loop, ensuring
    // that scroll positions and animations update in the exact same frame.
    const updateTicker = (time: number) => {
      // GSAP ticker provides time in seconds, Lenis expects milliseconds
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateTicker);

    // 3. Set lag smoothing to 0 to prevent GSAP animations from lag-refreshing
    gsap.ticker.lagSmoothing(0);

    // 4. Force ScrollTrigger refresh on initialization to compute scroll heights correctly
    ScrollTrigger.refresh();

    // Clean up connections on unmount to prevent memory leaks
    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(updateTicker);
    };
  }, [lenis]);

  return <>{children}</>;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07, // lowered from 0.1 for more premium fluid inertia
        wheelMultiplier: 1.15, // provides slightly more effortless scroll distance
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        autoRaf: false, // disable internal RAF to let GSAP's ticker manage it
      }}
    >
      <SmoothScrollInner>{children}</SmoothScrollInner>
    </ReactLenis>
  );
}
