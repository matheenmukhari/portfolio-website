"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap, ScrollTrigger, revealHeading, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import type { MediaItem, Project } from "@/lib/projects";
import { openProject } from "@/lib/transition";
import MediaGL from "./MediaGL";
import { accents } from "@/lib/text";

function renderMedia(item: MediaItem, className?: string) {
  const { src, alt, poster } = item;
  if (src.endsWith(".mp4") || src.endsWith(".webm")) {
    return (
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  return <MediaGL src={src} alt={alt ?? ""} className={className} />;
}

export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const briefTitle = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(0);
  const router = useRouter();

  // Optional media. A project with none of it still renders a full case study —
  // the text column is the case study; the media is supporting evidence.
  const reel = project.reel ?? [];
  const gallery = project.gallery ?? [];
  const strip = project.strip ?? [];
  const outcome = project.outcome ?? [];
  const hasReel = reel.length > 0;

  // Index of the last non-split item; the pull quote overlaps that item.
  const lastFullIdx = gallery.reduce((acc, item, i) => item.kind !== "split" ? i : acc, -1);

  const pullQuote = (
    <blockquote
      className={`type-h2 relative z-10 col-span-12 mt-6 italic ${lastFullIdx >= 0 ? "md:col-span-5 md:col-start-7 md:-mt-10 md:-ml-[8%]" : "md:col-span-8"}`}
      style={{ fontSize: "clamp(1.51rem, 2.16vw, 2.16rem)", lineHeight: 1.35, fontVariationSettings: '"opsz" 32, "wght" 400' }}
    >
      <div className="bg-stage/85 p-6 backdrop-blur-sm md:p-10">
        <p>{project.summary}</p>
        {project.note && (
          <p className="not-italic mt-4" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", lineHeight: 1.45, fontVariationSettings: '"wdth" 100, "wght" 400' }}>{project.note}</p>
        )}
        {project.points && project.points.length > 0 && (
          <ul className="mt-4 space-y-2 not-italic" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", lineHeight: 1.45, fontVariationSettings: '"wdth" 100, "wght" 400' }}>
            {project.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span aria-hidden className="mt-[0.55em] inline-block h-px w-4 shrink-0 bg-ochre" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </blockquote>
  );

  useIsoLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const cleanups: Array<() => void> = [];
    const triggers: ScrollTrigger[] = [];
    const q = <T extends Element>(sel: string) => Array.from(scope.querySelectorAll<T>(sel));

    if (heroTitle.current) cleanups.push(revealHeading(heroTitle.current, { delay: 0.15 }));

    if (prefersReducedMotion()) {
      if (briefTitle.current) gsap.set(briefTitle.current, { autoAlpha: 1 });
      return () => cleanups.forEach((fn) => fn());
    }

    if (briefTitle.current) {
      cleanups.push(
        revealHeading(briefTitle.current, {
          scrollTrigger: { trigger: briefTitle.current, start: "top 82%" },
        })
      );
    }

    const track = (t: gsap.core.Timeline | gsap.core.Tween) => {
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
      cleanups.push(() => t.kill());
    };

    /* ---- Hero: the poster settles as the page takes its first scroll ---- */
    const heroMedia = scope.querySelector<HTMLElement>(".case-hero-media");
    if (heroMedia) {
      track(
        gsap.to(heroMedia, {
          scale: 1.12,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: ".case-hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      );
    }

    /* ---- Frozen column: which of the three media is in the reading line ---- */
    q<HTMLElement>(".reel-item").forEach((item, i) => {
      const st = ScrollTrigger.create({
        trigger: item,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setStep(i),
        onEnterBack: () => setStep(i),
      });
      triggers.push(st);
    });



    /* ---- Stage media: each plate wipes up as it arrives ---- */
    q<HTMLElement>(".plate").forEach((plate) => {
      track(
        gsap.fromTo(
          plate,
          { clipPath: "inset(88% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            scrollTrigger: { trigger: plate, start: "top 86%", once: true },
          }
        )
      );
    });

    /* ---- Overlapping block: the two layers drift apart as you pass ---- */
    q<HTMLElement>("[data-drift]").forEach((el) => {
      const amount = parseFloat(el.dataset.drift ?? "0");
      track(
        gsap.fromTo(
          el,
          { yPercent: amount },
          {
            yPercent: -amount,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
          }
        )
      );
    });

    /* ---- Horizontal gallery, pinned and scrubbed ---- */
    const rail = scope.querySelector<HTMLElement>(".rail");
    const railTrack = scope.querySelector<HTMLElement>(".rail-track");
    if (rail && railTrack && window.innerWidth > 768) {
      const distance = () => railTrack.scrollWidth - window.innerWidth + 48;
      track(
        gsap.to(railTrack, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: rail,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Pinning injects a spacer and changes page height — refresh it
            // last so other triggers are not measured against a stale layout.
            refreshPriority: -1,
          },
        })
      );
    }

    /* ---- Outcome numbers count into place ---- */
    q<HTMLElement>(".stat-value").forEach((el) => {
      const raw = el.dataset.value ?? el.textContent ?? "";
      const match = raw.match(/-?[\d.,]+/);
      if (!match) return;
      const target = parseFloat(match[0].replace(/,/g, ""));
      const prefix = raw.slice(0, match.index ?? 0);
      const suffix = raw.slice((match.index ?? 0) + match[0].length);
      const obj = { v: 0 };
      track(
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            const n = target % 1 === 0 ? Math.round(obj.v) : obj.v.toFixed(1);
            el.textContent = `${prefix}${Number(n).toLocaleString()}${suffix}`;
          },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      );
    });

    ScrollTrigger.refresh();

    /* Client-side navigation measures before the media has loaded, so every
       trigger is positioned against the wrong page height — which is why a
       manual refresh "fixed" it. Re-measure once everything has settled. */
    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(scope.querySelectorAll("img"));
    images.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, 600);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      images.forEach((img) => img.removeEventListener("load", refresh));
      triggers.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
    };
  }, [project.slug]);

  return (
    <div ref={root}>
      {/* -------------------------------- hero -------------------------------- */}
      <section className="case-hero relative h-[100svh] w-full overflow-hidden bg-stage">
        <div className="case-hero-media absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.poster}
            alt={`${project.title} — ${project.summary}`}
            className="h-full w-full object-cover opacity-85"
          />
        </div>

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-stage/55 via-transparent to-stage/75"
        />

        <div className="page-x relative flex h-full flex-col justify-end pb-[calc(var(--spacing-page)+2.5rem)] text-paper">
          <h1
            ref={heroTitle}
            className="type-mega invisible"
            // ~20% below the index sheets: a case study opens quieter than the
            // grid that led you into it.
            style={{
              fontSize: "clamp(2.6rem, 10vw, 6.8rem)",
              fontVariationSettings: '"opsz" 72, "wght" 440',
            }}
          >
            {project.title}
          </h1>
          <div className="mt-5 grid grid-cols-12 gap-x-[var(--spacing-gutter)] gap-y-2">
            <p className="type-micro col-span-12 sm:col-span-6 md:col-span-3">{project.client}</p>
            <p className="type-micro col-span-12 sm:col-span-6 md:col-span-3">
              {project.place} — {project.year}
            </p>
            <p className="type-micro col-span-12 md:col-span-5">{project.categories.join(" / ")}</p>
          </div>
        </div>
      </section>

      {/* ---------------------- chapter one: the frozen split ------------------ */}
      <div className="chapter-one relative z-[1] bg-paper">
        <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] pt-[12svh] pb-[14svh]">
          {/* Left: the reel scrolls. */}
          {hasReel && (
          <div className="col-span-12 flex flex-col gap-[10svh] md:col-span-5">
            {reel.map((item, i) => (
              <figure key={item.src} className="reel-item">
               <MediaGL
  src={item.src}
  alt={item.alt ?? ""}
  interactive={false}
  className="w-full"
  style={{ aspectRatio: item.aspect ?? "16/9" }}
/>
              </figure>
            ))}
          </div>
          )}

          {/* Right: frozen while the reel moves past it. With no reel it takes
              the page on its own — never hidden, since this is the case study. */}
          <div
            className={
              hasReel
                ? "col-span-12 md:col-span-6 md:col-start-7"
                : "col-span-12 md:col-span-9 md:col-start-2"
            }
          >
            <div className={hasReel ? "md:sticky md:top-[15svh]" : ""}>
              <p
                ref={briefTitle}
                className="invisible"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.8rem, 2.9vw, 3.3rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.018em",
                  fontVariationSettings: '"opsz" 48, "wght" 410',
                }}
              >
                {accents(project.brief)}
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-[var(--spacing-gutter)] gap-y-7">
                <div className="col-span-2 measure space-y-5">
                  {project.body.map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>

                <div>
                  <h2 className="type-micro text-graphite">Role</h2>
                  <ul className="mt-3 space-y-1">
                    {project.role.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  {project.credits && (
                    <>
                      <h2 className="type-micro text-graphite">Credits</h2>
                      <p className="mt-3">{project.credits}</p>
                    </>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      data-cursor="link"
                      className="type-micro mt-6 inline-block border-b border-ink pb-1 hover:border-ochre hover:text-ochre"
                    >
                      Visit site
                    </a>
                  )}
                </div>
              </div>

              {/* The read-out tells you where the reel has got to. */}
              {hasReel && (
                <p className="type-micro tnum mt-10 text-graphite">
                  Now showing — {reel[step]?.caption ?? reel[0]?.caption}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* --------------------------- the stage takes over ---------------------- */}
      {(gallery.length > 0 || strip.length > 0 || outcome.length > 0) && (
      <div className="stage relative z-[2] bg-stage text-paper">
        {gallery.length > 0 && (
        <>
        {(() => {
          const nodes: React.ReactNode[] = [];
          let i = 0;
          while (i < gallery.length) {
            const item = gallery[i];
            if (item.kind !== "split") {
              if (i === lastFullIdx) {
                nodes.push(
                  <section key={item.src} className="page-x relative grid grid-cols-12 items-center gap-[var(--spacing-gutter)] pb-[14svh]">
                    <div className="plate col-span-12 md:col-span-8">
                      {renderMedia(item, "aspect-[16/9] w-full")}
                    </div>
                    {pullQuote}
                  </section>
                );
              } else {
                nodes.push(
                  <section key={item.src} className="plate relative h-[110svh] w-full overflow-hidden">
                    {renderMedia(item, "h-full w-full")}
                  </section>
                );
              }
              i++;
            } else {
              const second = i + 1 < gallery.length && gallery[i + 1].kind === "split" ? gallery[i + 1] : undefined;
              nodes.push(
                <section key={item.src} className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] py-[12svh]">
                  <div className="plate col-span-12 md:col-span-6" data-drift="4">
                    {renderMedia(item, "aspect-[4/5] w-full")}
                  </div>
                  {second && (
                    <div className="plate col-span-12 md:col-span-5 md:col-start-8 md:mt-[16svh]" data-drift="-5">
                      {renderMedia(second, "aspect-[4/5] w-full")}
                    </div>
                  )}
                </section>
              );
              i += second ? 2 : 1;
            }
          }
          if (lastFullIdx === -1) {
            nodes.push(
              <section key="__blockquote" className="page-x relative grid grid-cols-12 items-center gap-[var(--spacing-gutter)] pb-[14svh]">
                {pullQuote}
              </section>
            );
          }
          return nodes;
        })()}
        </>
        )}

        {/* Horizontal gallery, pinned. */}
        {strip.length > 0 && (
        <section className="rail relative flex h-[72svh] flex-col justify-center overflow-hidden md:h-[100svh]">
          <div className="page-x type-micro mb-6 flex justify-between text-paper/60">
            <span>Process and detail</span>
            <span className="tnum">{String(strip.length).padStart(2, "0")} frames</span>
          </div>
          <div
            className="rail-track flex gap-[var(--spacing-gutter)] px-[var(--spacing-page)] max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-4 max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none]"
            data-cursor="drag"
          >
            {strip.map((item) => (
              <div
  key={item.src}
  className="h-[42svh] w-auto shrink-0 max-md:snap-start md:h-[58svh]"
  style={{ aspectRatio: item.aspect ?? "16/9" }}
>
  <MediaGL src={item.src} alt={item.alt ?? ""} className="h-full w-full" />
</div>
            ))}
          </div>
        </section>
        )}

        {/* Outcome. */}
        {outcome.length > 0 && (
        <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] border-t border-paper/15 py-[12svh]">
          {outcome.map((stat) => (
            <div key={stat.label} className="col-span-12 md:col-span-4">
              <p
                className="stat-value type-display tnum"
                data-value={stat.value}
                style={{ fontVariationSettings: '"opsz" 60, "wght" 420' }}
              >
                {stat.value}
              </p>
              <p className="type-micro mt-3 text-paper/60">{stat.label}</p>
            </div>
          ))}
        </section>
        )}
      </div>
      )}

      {/* ------------------------------ next project --------------------------- */}
      <section className="relative z-[2] bg-paper">
        <a
          href={`/work/${next.slug}`}
          data-cursor="view"
          onClick={(e) => {
            e.preventDefault();
            openProject(router, `/work/${next.slug}`, e.currentTarget.querySelector(".next-media"));
          }}
          className="page-x grid grid-cols-12 items-end gap-[var(--spacing-gutter)] py-[10svh]"
        >
          <p className="type-micro col-span-12 mb-6 text-graphite">Next project</p>
          <div className="next-media col-span-12 h-[52svh] md:col-span-7">
            <MediaGL src={next.poster} alt={next.title} className="h-full w-full" />
          </div>
          <div className="col-span-12 md:col-span-5">
            <h2 className="type-display" style={{ fontSize: "clamp(1.8rem, 0.84rem + 4.2vw, 5.1rem)", fontVariationSettings: '"opsz" 60, "wght" 440' }}>
              {next.title}
            </h2>
            <p className="type-micro mt-4 text-graphite">
              {next.categories.join(" / ")} — {next.place} {next.year}
            </p>
          </div>
        </a>

        <div className="page-x flex justify-between border-t border-hairline py-8">
          <Link href="/work" data-cursor="link" className="type-micro hover:text-ochre">
            All work
          </Link>
          <Link href="/" data-cursor="link" className="type-micro hover:text-ochre">
            Index
          </Link>
        </div>
      </section>
    </div>
  );
}
