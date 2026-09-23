"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

if (typeof window !== "undefined" && !registered) {
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, Observer, Flip, CustomEase);
  // One house ease, used everywhere a thing arrives.
  CustomEase.create("sheet", "0.16, 1, 0.3, 1");
  gsap.defaults({ ease: "sheet", duration: 0.9 });
}

export { gsap, ScrollTrigger, SplitText, Observer, Flip };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveal a heading by line, opening the variable width axis as it rises.
 * Returns a cleanup that reverts the split so text stays copyable / accessible.
 */
export function revealHeading(
  el: HTMLElement,
  opts: { delay?: number; scrollTrigger?: ScrollTrigger.Vars; stagger?: number } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return () => {};
  }

  const split = SplitText.create(el, {
    type: "lines",
    linesClass: "js-reveal-line",
    autoSplit: true,
    mask: "lines",
  });

  gsap.set(el, { autoAlpha: 1 });

  const tween = gsap.fromTo(
    split.lines,
    { yPercent: 118, rotate: 1.2 },
    {
    yPercent: 0,
    rotate: 0,
    duration: 1.15,
    stagger: opts.stagger ?? 0.075,
    delay: opts.delay ?? 0,
    ...(opts.scrollTrigger ? { scrollTrigger: { trigger: el, start: "top 85%", once: true, ...opts.scrollTrigger } } : {}),
    }
  );

  // Optical size opens a beat behind the rise — the serif "settling" into
  // its display cut: hairlines thin out, joints tighten, as it lands.
  const widen = gsap.fromTo(
    el,
    { fontVariationSettings: '"opsz" 14, "wght" 380' },
    {
      fontVariationSettings: '"opsz" 72, "wght" 430',
      duration: 1.5,
      delay: (opts.delay ?? 0) + 0.12,
      ...(opts.scrollTrigger ? { scrollTrigger: { trigger: el, start: "top 85%", once: true, ...opts.scrollTrigger } } : {}),
    }
  );

  return () => {
    tween.kill();
    widen.kill();
    split.revert();
  };
}

/** Fade + rise for blocks of body copy and meta rows. */
export function revealBlock(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    targets,
    { autoAlpha: 0, y: 28 },
    { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ...vars }
  );
}
