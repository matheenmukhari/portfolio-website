'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import styles from './HeroReveal.module.css';

type Props = {
  src: string;
  /** Radius of the revealed area, in px. */
  radius?: number;
  /** 0–1. Lower values make the reveal trail further behind the cursor. */
  ease?: number;
};

/**
 * Drop this in as a child of the hero <section>. The section needs
 * `relative isolate overflow-hidden`. Everything else stays as it is.
 */
export default function HeroReveal({ src, radius = 240, ease = 0.14 }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;

    // No hover on touch devices, and reduced-motion users opted out.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Target vs current, so the reveal trails the cursor instead of snapping.
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let targetOn = 0;
    let on = 0;
    let seeded = false;
    let frame = 0;

    // Last viewport position, so scrolling under a still cursor stays correct.
    let clientX = 0;
    let clientY = 0;

    const draw = () => {
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      on += (targetOn - on) * 0.12;

      layer.style.setProperty('--mx', `${x}px`);
      layer.style.setProperty('--my', `${y}px`);
      layer.style.setProperty('--r', `${radius * (0.4 + on * 0.6)}px`);

      const settled =
        Math.abs(targetX - x) < 0.5 &&
        Math.abs(targetY - y) < 0.5 &&
        Math.abs(targetOn - on) < 0.01;

      frame = settled ? 0 : requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const setTarget = () => {
      const rect = host.getBoundingClientRect();
      targetX = clientX - rect.left;
      targetY = clientY - rect.top;
      if (!seeded) {
        seeded = true;
        x = targetX;
        y = targetY;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      clientX = e.clientX;
      clientY = e.clientY;
      setTarget();
      targetOn = 1;
      layer.dataset.active = 'true';
      start();
    };

    const onLeave = () => {
      targetOn = 0;
      layer.dataset.active = 'false';
      start();
    };

    // Lenis moves the page, not the cursor, so recompute on scroll.
    const onScroll = () => {
      if (targetOn === 0) return;
      setTarget();
      start();
    };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [radius, ease]);

  return (
    <div ref={layerRef} className={styles.layer} data-active="false" aria-hidden="true">
      <Image src={src} alt="" fill sizes="100vw" priority />
    </div>
  );
}
