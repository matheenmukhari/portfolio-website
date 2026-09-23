"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True while the element is anywhere near the viewport — used to mount/unmount WebGL. */
export function useInView<T extends HTMLElement>(rootMargin = "40% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Cheap WebGL capability probe, cached for the session. */
let webglSupport: boolean | null = null;
export function useWebGL() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (webglSupport === null) {
      try {
        const canvas = document.createElement("canvas");
        webglSupport = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl"))
        );
      } catch {
        webglSupport = false;
      }
    }
    setOk(webglSupport);
  }, []);
  return ok;
}
