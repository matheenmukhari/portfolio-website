'use client';

import { useEffect, useRef } from 'react';

type Props = {
  /** Gap between dots, px. Larger = fewer dots = cheaper. */
  spacing?: number;
  /** How far the cursor's influence reaches, px. */
  radius?: number;
  /** How hard dots are pushed away. */
  strength?: number;
  /** Dot colour as "r, g, b". Defaults to the ink in your palette. */
  rgb?: string;
};

/**
 * A field of dots that parts around the cursor and drifts back.
 * Drop in as a child of the hero <section>, which needs
 * `relative isolate overflow-hidden`. Mounts and cleans up with the
 * hero alone, so no other page is affected.
 */
export default function HeroField({
  spacing = 15,
  radius = 170,
  strength = 44,
  rgb = '20, 19, 15',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SPRING = 0.028;
    const DAMP = 0.9;
    const DOT = 1.6;

    type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let mx = -9999;
    let my = -9999;
    let frame = 0;
    let pointerIn = false;
    let onScreen = true;

    const build = () => {
      const rect = host.getBoundingClientRect();
      // Cap DPR: at this dot count, 3x pixels buys nothing visible.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      const ox = (w % spacing) / 2;
      const oy = (h % spacing) / 2;
      for (let y = oy; y <= h; y += spacing) {
        for (let x = ox; x <= w; x += spacing) {
          dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const r2 = radius * radius;
      let moving = false;

      for (const d of dots) {
        const dx = d.x - mx;
        const dy = d.y - my;
        const dd = dx * dx + dy * dy;

        if (dd < r2 && dd > 0.01) {
          const dist = Math.sqrt(dd);
          const falloff = 1 - dist / radius;
          const push = falloff * falloff * strength;
          d.vx += (dx / dist) * push;
          d.vy += (dy / dist) * push;
        }

        // Spring home, with damping. Weak spring + high damping is what
        // gives the slow wake behind a fast cursor.
        d.vx += (d.hx - d.x) * SPRING;
        d.vy += (d.hy - d.y) * SPRING;
        d.vx *= DAMP;
        d.vy *= DAMP;
        d.x += d.vx;
        d.y += d.vy;

        const off = Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy);
        if (off > 0.3 || Math.abs(d.vx) + Math.abs(d.vy) > 0.3) moving = true;

        // Displaced dots darken, so the disturbance reads as an edge.
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(0.5, 0.1 + off * 0.012)})`;
        ctx.fillRect(d.x - DOT / 2, d.y - DOT / 2, DOT, DOT);
      }

      // Idle when nothing is in motion: no wasted frames.
      frame = moving || pointerIn ? requestAnimationFrame(draw) : 0;
    };

    const start = () => {
      if (!frame && onScreen) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      pointerIn = true;
      start();
    };

    const onLeave = () => {
      mx = -9999;
      my = -9999;
      pointerIn = false;
      start();
    };

    // Stop entirely once the hero scrolls away.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (!onScreen && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else if (onScreen) {
          start();
        }
      },
      { threshold: 0 }
    );
    io.observe(host);

    const ro = new ResizeObserver(() => {
      build();
      start();
    });
    ro.observe(host);

    build();
    start();

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);

    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      io.disconnect();
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [spacing, radius, strength, rgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
