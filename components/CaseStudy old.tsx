"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap, ScrollTrigger, revealHeading, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import type { Project } from "@/lib/projects";
import { openProject } from "@/lib/transition";
import MediaGL from "./MediaGL";
import { accents } from "@/lib/text";

export default function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const briefTitle = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(0);
  const router = useRouter();

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
          scrollTrigger: { trigger: ".case-hero", start: "top top", end: "bottom top", scrub: true },
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

    /* ---- The hand-off: chapter one lifts away, the stage takes the screen --- */
    const chapter = scope.querySelector<HTMLElement>(".chapter-one");
    const stage = scope.querySelector<HTMLElement>(".stage");
    if (chapter && stage) {
      track(
        gsap.to(chapter, {
          yPercent: -9,
          scale: 0.955,
          autoAlpha: 0.28,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "top top", scrub: 0.4 },
        })
      );
    }

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

    return () => {
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
            style={{ fontVariationSettings: '"opsz" 72, "wght" 440' }}
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
      {project.reel && <div className="chapter-one relative z-[1] bg-paper">
        <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] pt-[12svh] pb-[14svh]">
          {/* Left: the reel scrolls. */}
          <div className="col-span-12 flex flex-col gap-[10svh] md:col-span-5">
            {project.reel.map((item, i) => (
              <figure key={item.src} className="reel-item">
                <MediaGL
                  src={item.src}
                  alt={item.alt ?? ""}
                  className="aspect-[4/3] w-full"
                  interactive={i === 0}
                />
                <figcaption className="type-micro mt-3 flex justify-between text-graphite">
                  <span>{item.caption}</span>
                  <span className="tnum">
                    {String(i + 1).padStart(2, "0")} / {String(project.reel?.length ?? 0).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Right: frozen while the reel moves past it. */}
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <div className="md:sticky md:top-[15svh]">
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
                  <h2 className="type-micro text-graphite">Credits</h2>
                  <p className="mt-3">{project.credits}</p>
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
              <p className="type-micro tnum mt-10 text-graphite">
                Now showing — {project.reel[step]?.caption ?? project.reel[0].caption}
              </p>
            </div>
          </div>
        </section>
      </div>}

      {/* --------------------------- the stage takes over ---------------------- */}
      {project.gallery && project.gallery.length >= 4 && <div className="stage relative z-[2] bg-stage text-paper">
        <section className="plate relative h-[110svh] w-full overflow-hidden">
          <MediaGL
            src={project.gallery[0].src}
            alt={project.gallery[0].alt ?? ""}
            className="h-full w-full"
          />
        </section>

        <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] py-[12svh]">
          <div className="plate col-span-12 md:col-span-6" data-drift="4">
            <MediaGL
              src={project.gallery[1].src}
              alt={project.gallery[1].alt ?? ""}
              className="aspect-[4/5] w-full"
            />
          </div>
          <div className="plate col-span-12 md:col-span-5 md:col-start-8 md:mt-[16svh]" data-drift="-5">
            <MediaGL
              src={project.gallery[2].src}
              alt={project.gallery[2].alt ?? ""}
              className="aspect-[4/5] w-full"
            />
          </div>
        </section>

        {/* Overlap: type sits over the plate rather than beside it. */}
        <section className="page-x relative grid grid-cols-12 items-center gap-[var(--spacing-gutter)] pb-[14svh]">
          <div className="plate col-span-12 md:col-span-8">
            <MediaGL
              src={project.gallery[3].src}
              alt={project.gallery[3].alt ?? ""}
              className="aspect-[16/10] w-full"
            />
          </div>
          <blockquote
            className="type-h2 relative z-10 col-span-12 mt-6 italic md:col-span-5 md:col-start-7 md:-mt-10 md:-ml-[8%]"
            style={{ fontVariationSettings: '"opsz" 40, "wght" 400' }}
          >
            <p className="bg-stage/85 p-6 backdrop-blur-sm md:p-10">{project.summary}</p>
          </blockquote>
        </section>

        {/* Horizontal gallery, pinned. */}
        {project.strip && project.strip.length > 0 && (
          <section className="rail relative flex h-[72svh] flex-col justify-center overflow-hidden md:h-[100svh]">
            <div className="page-x type-micro mb-6 flex justify-between text-paper/60">
              <span>Process and detail</span>
              <span className="tnum">{String(project.strip.length).padStart(2, "0")} frames</span>
            </div>
            <div
              className="rail-track flex gap-[var(--spacing-gutter)] px-[var(--spacing-page)] max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-4 max-md:[-ms-overflow-style:none] max-md:[scrollbar-width:none]"
              data-cursor="drag"
            >
              {project.strip.map((item) => (
                <div
                  key={item.src}
                  className="h-[42svh] w-[82vw] shrink-0 max-md:snap-start md:h-[58svh] md:w-[min(72vw,44rem)]"
                >
                  <MediaGL src={item.src} alt={item.alt ?? ""} className="h-full w-full" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Outcome. */}
        {project.outcome && (
          <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] border-t border-paper/15 py-[12svh]">
            {project.outcome.map((stat) => (
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
      </div>}

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
            <h2 className="type-display" style={{ fontVariationSettings: '"opsz" 60, "wght" 440' }}>
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
