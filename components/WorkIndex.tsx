"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap, Flip, revealHeading, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { CATEGORY_COUNTS, WORK, type Category } from "@/lib/projects";
import { openProject } from "@/lib/transition";
import MediaGL from "./MediaGL";

const RATIO: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

export default function WorkIndex() {
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState<Category | null>(null);
  const router = useRouter();

  const items = useMemo(
    () => (active ? WORK.filter((w) => w.categories.includes(active)) : WORK),
    [active]
  );

  useIsoLayoutEffect(() => {
    if (!title.current) return;
    const cleanup = revealHeading(title.current, { delay: 0.1 });
    return () => cleanup();
  }, []);

  useIsoLayoutEffect(() => {
    const scope = root.current;
    if (!scope || prefersReducedMotion()) return;
    const cards = Array.from(scope.querySelectorAll<HTMLElement>(".work-card"));
    if (!cards.length) return;

    const tween = gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 1, stagger: 0.05, delay: 0.35 }
    );

    // An entrance animation must never be the reason content is unreachable.
    // If anything interrupts the tween — a double-invoked effect, a stalled
    // ticker, a backgrounded tab — this puts the grid back on screen.
    const failsafe = window.setTimeout(() => {
      if (tween.progress() < 1) {
        gsap.set(cards, { clearProps: "opacity,visibility,transform" });
      }
    }, 2500);

    return () => {
      window.clearTimeout(failsafe);
      // revert(), not kill(): kill() would leave the start values baked in.
      tween.revert();
    };
  }, []);

  /**
   * Filtering is one continuous movement: capture where every card is, swap
   * the list, then let Flip carry each survivor to its new slot.
   */
  const filter = (next: Category | null) => {
    if (next === active) return;
    if (prefersReducedMotion() || !grid.current) {
      setActive(next);
      return;
    }
    const state = Flip.getState(grid.current.querySelectorAll(".work-card"));
    setActive(next);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.75,
        ease: "sheet",
        stagger: 0.03,
        absolute: true,
        scale: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.4 }),
      });
    });
  };

  return (
    <div ref={root} className="page-x pt-[26svh] pb-[12svh]">
      <header className="mb-[8svh] grid grid-cols-12 items-end gap-[var(--spacing-gutter)]">
        <h1
          ref={title}
          className="type-mega invisible col-span-12 md:col-span-7"
          style={{ fontVariationSettings: '"opsz" 72, "wght" 430' }}
        >
          Work
        </h1>
        <p className="type-micro col-span-12 pb-4 text-graphite md:col-span-4 md:col-start-9">
          Twelve selected pieces across websites, campaigns, print and events. Sample content
          throughout.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-[var(--spacing-gutter)]">
        {/* ------------------------------ filters ------------------------------ */}
        {/* On phones the filters ride along the top of the grid as a single
            scrollable row; from md they become a sticky index column. */}
        <nav
          className="col-span-12 max-md:sticky max-md:top-[3.25rem] max-md:z-30 max-md:-mx-[var(--spacing-page)] max-md:mb-2 max-md:bg-paper/92 max-md:px-[var(--spacing-page)] max-md:py-3 max-md:backdrop-blur-sm md:col-span-3"
          aria-label="Filter work by discipline"
        >
          <div className="md:sticky md:top-[22svh]">
            <ul className="flex gap-x-6 gap-y-1 max-md:flex-nowrap max-md:overflow-x-auto max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none] md:block">
              <li className="shrink-0">
                <FilterButton
                  label="Everything"
                  count={WORK.length}
                  active={active === null}
                  onClick={() => filter(null)}
                />
              </li>
              {CATEGORY_COUNTS.map(({ name, count }) => (
                <li key={name} className="shrink-0">
                  <FilterButton
                    label={name}
                    count={count}
                    active={active === name}
                    onClick={() => filter(name)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* -------------------------------- grid -------------------------------- */}
        <div
          ref={grid}
          className="col-span-12 grid grid-cols-6 gap-x-[var(--spacing-gutter)] gap-y-[7svh] [grid-auto-flow:dense] md:col-span-8 md:col-start-5"
        >
          {items.map((item, i) => {
            const wide = item.ratio === "landscape";
            const href = item.slug ? `/work/${item.slug}` : undefined;
            const Card = (
              <>
                <div className={`${RATIO[item.ratio]} w-full`}>
                  <MediaGL src={item.image} alt={`${item.title} — ${item.client}`} className="h-full w-full" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.3rem, 1.9vw, 2.1rem)",
                      lineHeight: 1.06,
                      letterSpacing: "-0.015em",
                      fontVariationSettings: '"opsz" 36, "wght" 430',
                    }}
                  >
                    {item.title}
                  </h2>
                  <span className="type-micro tnum text-graphite">{item.year}</span>
                </div>
                <p className="type-micro mt-2 text-graphite">{item.categories.join(" / ")}</p>
              </>
            );

            return (
              <article
                key={`${item.title}-${i}`}
                className={`work-card ${wide ? "col-span-6" : "col-span-6 sm:col-span-3"}`}
              >
                {href ? (
                  <a
                    href={href}
                    data-cursor="view"
                    onClick={(e) => {
                      e.preventDefault();
                      openProject(router, href, e.currentTarget.querySelector("div"));
                    }}
                  >
                    {Card}
                  </a>
                ) : (
                  <div data-cursor="hide">{Card}</div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      data-cursor="link"
      aria-pressed={active}
      className="group block py-[0.18em] text-left whitespace-nowrap"
      onPointerEnter={() => {
        if (!prefersReducedMotion() && ref.current) {
          gsap.to(ref.current, { fontVariationSettings: '"wdth" 112, "wght" 520', duration: 0.5 });
        }
      }}
      onPointerLeave={() => {
        if (!prefersReducedMotion() && ref.current) {
          gsap.to(ref.current, {
            fontVariationSettings: active
              ? '"wdth" 108, "wght" 560'
              : '"wdth" 92, "wght" 440',
            duration: 0.5,
          });
        }
      }}
      style={{
        fontSize: "clamp(1.05rem, 1.5vw, 1.6rem)",
        lineHeight: 1.22,
        letterSpacing: "-0.01em",
        fontVariationSettings: active ? '"wdth" 108, "wght" 560' : '"wdth" 92, "wght" 440',
        color: active ? "var(--color-ink)" : "var(--color-graphite)",
      }}
    >
      {label}
      <sup className="type-micro tnum ml-1.5 align-super text-[0.55em]">{count}</sup>
      <span
        className="mt-0.5 block h-px origin-left bg-ochre transition-transform duration-500"
        style={{ transform: `scaleX(${active ? 1 : 0})` }}
      />
    </button>
  );
}
