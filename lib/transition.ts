"use client";

import { gsap, prefersReducedMotion } from "./gsap";

type Router = { push: (href: string) => void };

/**
 * Index → case study handoff. The clicked media is cloned into a body-level
 * layer and grown to full bleed; the new page opens on the same asset, so the
 * cut lands on a matching frame instead of a white flash.
 */
export function openProject(router: Router, href: string, source: HTMLElement | null) {
  if (prefersReducedMotion() || !source) {
    router.push(href);
    return;
  }

  const rect = source.getBoundingClientRect();
  const img = source.querySelector("img");
  const src = img?.getAttribute("src") ?? "";

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = `position:fixed;z-index:94;overflow:hidden;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;will-change:transform,width,height;background:#000;`;
  layer.innerHTML = `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover" />`;
  document.body.appendChild(layer);

  gsap.to(layer, {
    left: 0,
    top: 0,
    width: "100vw",
    height: "100svh",
    duration: 0.72,
    ease: "sheet",
    onStart: () => router.push(href),
  });

  gsap.to(layer, {
    autoAlpha: 0,
    duration: 0.45,
    delay: 0.62,
    onComplete: () => layer.remove(),
  });

  // Safety net: never leave the layer behind if navigation stalls.
  window.setTimeout(() => layer.remove(), 2200);
}
