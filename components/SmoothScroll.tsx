"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.05,
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      smoothWheel: true,
      // Feels like weight rather than lag: fast start, long settle.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    rafRef.current = raf;
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // New route: top of page, then let every trigger re-measure once layout settles.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    if (reduced) window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis, reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
