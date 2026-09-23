"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";

const TILES = [
  "/media/ops/poster.webp",
  "/media/vl/poster.webp",
  "/media/sp/poster.webp",
  "/media/ed/poster.webp",
  "/media/pulse/poster.webp",
  "/media/cb/poster.webp",
  "/media/gf/poster.webp",
  "/media/ops/still.webp",
];

export const INTRO_EVENT = "intro:done";

/**
 * Runs once per session. A grid of work slides into place while the counter
 * fills, then the grid itself leaves the screen — the same vertical gesture
 * the index sheets use, so the site's motion vocabulary is set before the
 * first scroll.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();
  // Rendered in the server HTML so there is never a flash of the page before
  // the sequence starts; the mount effect below decides whether it actually runs.
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("mb-intro") === "done") {
      setActive(false);
      document.documentElement.classList.remove("is-loading");
      window.dispatchEvent(new CustomEvent(INTRO_EVENT));
      return;
    }
    if (!active) return;

    const finish = () => {
      sessionStorage.setItem("mb-intro", "done");
      setActive(false);
      document.documentElement.classList.remove("is-loading");
      lenis?.start();
      window.dispatchEvent(new CustomEvent(INTRO_EVENT));
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    document.documentElement.classList.add("is-loading");
    lenis?.stop();

    const scope = rootRef.current;
    if (!scope) return;
    const tiles = Array.from(scope.querySelectorAll<HTMLElement>(".intro-tile"));
    const metas = Array.from(scope.querySelectorAll<HTMLElement>(".intro-meta"));
    const word = scope.querySelector<HTMLElement>(".intro-word");

    const tl = gsap.timeline({ onComplete: finish });
    {
      const count = { v: 0 };

      tl.set(tiles, { yPercent: (i) => (i % 2 ? 110 : -110), autoAlpha: 0 })
        .to(tiles, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.15,
          stagger: { each: 0.055, from: "start" },
        })
        .to(
          count,
          {
            v: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(count.v)}`.padStart(3, "0");
              }
            },
          },
          0.1
        )
        .to(word, { fontVariationSettings: '"opsz" 72, "wght" 460', duration: 1.2 }, 0.25)
        // The grid closes up, then the whole sheet lifts away.
        .to(tiles, { scale: 0.96, duration: 0.6, stagger: 0.02 }, "-=0.35")
        .to(
          tiles,
          { yPercent: (i) => (i % 2 ? -108 : 108), autoAlpha: 0, duration: 0.9, stagger: 0.035 },
          "-=0.2"
        )
        .to(metas, { autoAlpha: 0, duration: 0.4 }, "-=0.7")
        .to(scope, { yPercent: -100, duration: 1.05, ease: "sheet" }, "-=0.45");
    }

    // If anything stalls (background tab, blocked raf), the site still opens.
    const failsafe = window.setTimeout(() => {
      if (tl.isActive() || tl.progress() < 1) {
        tl.progress(1);
      }
    }, 6000);

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
    };
  }, [active, lenis]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="intro-overlay fixed inset-0 z-[95] flex flex-col justify-between bg-paper px-[var(--spacing-page)] py-[var(--spacing-page)]"
      aria-hidden
    >
      <div className="intro-meta type-micro flex justify-between">
        <span>Matheen Bukhari</span>
        <span>Creative direction — Dubai</span>
      </div>

      <div className="grid grid-cols-4 gap-[var(--spacing-gutter)] md:grid-cols-8">
        {TILES.map((src) => (
          <div key={src} className="intro-tile relative aspect-[3/4] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="intro-meta flex items-end justify-between">
        <span className="intro-word type-display" style={{ fontVariationSettings: '"opsz" 12, "wght" 330' }}>
          Matheen Bukhari
        </span>
        <span className="type-micro tnum">
          <span ref={counterRef}>000</span>%
        </span>
      </div>
    </div>
  );
}
