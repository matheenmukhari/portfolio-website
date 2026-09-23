"use client";

import { useEffect, useRef } from "react";

/** The read-out is the actual scroll position, not decoration. */
export default function ScrollReadout() {
  const numberRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (numberRef.current) {
        numberRef.current.textContent = `${Math.round(pct * 100)}`.padStart(2, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="page-x pointer-events-none fixed inset-x-0 bottom-0 z-50 pb-[var(--spacing-page)] mix-blend-difference">
      <div className="flex items-center gap-3">
        <span className="type-micro tnum text-paper">
          <span ref={numberRef}>00</span>%
        </span>
        <span className="relative h-px w-[clamp(56px,7vw,120px)] overflow-hidden bg-paper/30">
          <span
            ref={barRef}
            className="absolute inset-0 origin-left bg-ochre"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
    </div>
  );
}
