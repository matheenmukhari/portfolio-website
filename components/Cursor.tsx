"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery, useReducedMotion } from "@/lib/hooks";

/**
 * One round thing on an otherwise square site. It reads the nearest
 * `data-cursor` attribute, so any element can set the label without wiring
 * state through React: data-cursor="view" | "drag" | "close" | "link" | "hide".
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine) return;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    document.body.dataset.cursorActive = "true";
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(dot, "x", { duration: reduced ? 0 : 0.32, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: reduced ? 0 : 0.32, ease: "power3" });

    let current = "";

    const setState = (state: string) => {
      if (state === current) return;
      current = state;

      const map: Record<string, { size: number; text: string; fill: boolean }> = {
        "": { size: 10, text: "", fill: true },
        link: { size: 34, text: "", fill: false },
        view: { size: 92, text: "VIEW", fill: true },
        drag: { size: 92, text: "DRAG", fill: true },
        close: { size: 78, text: "CLOSE", fill: true },
        hide: { size: 0, text: "", fill: true },
      };
      const cfg = map[state] ?? map[""];

      label.textContent = cfg.text;
      gsap.to(dot, {
        width: cfg.size,
        height: cfg.size,
        backgroundColor: cfg.fill ? "var(--color-paper)" : "transparent",
        borderWidth: cfg.fill ? 0 : 1,
        duration: reduced ? 0 : 0.45,
        ease: "sheet",
      });
      gsap.to(label, { autoAlpha: cfg.text ? 1 : 0, duration: 0.25 });
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setState(target?.dataset.cursor ?? "");
    };

    const onLeave = () => gsap.to(dot, { autoAlpha: 0, duration: 0.2 });
    const onEnter = () => gsap.to(dot, { autoAlpha: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      delete document.body.dataset.cursorActive;
    };
  }, [fine, reduced]);

  if (!fine) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] flex h-[10px] w-[10px] items-center justify-center rounded-full border border-paper bg-paper mix-blend-difference"
      style={{ transform: "translate3d(-100px,-100px,0)" }}
    >
      <span
        ref={labelRef}
        className="type-micro text-ink opacity-0 select-none"
        style={{ fontSize: 11, letterSpacing: "0.14em" }}
      />
    </div>
  );
}
