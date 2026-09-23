"use client";
import HeroReveal from "./HeroReveal";
import HeroField from "./HeroField";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap, ScrollTrigger, revealHeading, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { PROJECTS } from "@/lib/projects";
import { openProject } from "@/lib/transition";
import MediaGL from "./MediaGL";
import Contact from "./Contact";
import { INTRO_EVENT } from "./Preloader";


export default function IndexExperience() {
  const root = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const heroMeta = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useIsoLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;

    const cleanups: Array<() => void> = [];
    const triggers: ScrollTrigger[] = [];
    const q = <T extends Element>(sel: string) => Array.from(scope.querySelectorAll<T>(sel));

    /* ---- Hero: held back until the load sequence clears the screen ---- */
    let heroStarted = false;
    const startHero = () => {
      if (heroStarted) return;
      heroStarted = true;
      if (heroTitle.current) cleanups.push(revealHeading(heroTitle.current));
      const meta = heroMeta.current ? Array.from(heroMeta.current.children) : [];
      if (meta.length && !prefersReducedMotion()) {
        gsap.fromTo(
          meta,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, delay: 0.25 }
        );
      }
    };

    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("mb-intro") === "done") {
      startHero();
    } else {
      window.addEventListener(INTRO_EVENT, startHero, { once: true });
      // Failsafe: the hero is never allowed to stay hidden.
      const failsafe = window.setTimeout(startHero, 5000);
      cleanups.push(() => {
        window.removeEventListener(INTRO_EVENT, startHero);
        window.clearTimeout(failsafe);
      });
    }

    if (prefersReducedMotion()) {
      gsap.set(q(".sheet-media, .sheet-title, .sheet-meta"), { clearProps: "all" });
      return () => cleanups.forEach((fn) => fn());
    }

    /* ---- Parallax: each element moves at its own rate inside the sheet ---- */
    q<HTMLElement>("[data-speed]").forEach((el) => {
      const speed = parseFloat(el.dataset.speed ?? "1");
      const tween = gsap.fromTo(
        el,
        { yPercent: (1 - speed) * 20 },
        {
          yPercent: (speed - 1) * 20,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      cleanups.push(() => tween.kill());
    });

    /* ---- Sheet arrival: media wipes up, title rises and opens its width ---- */
    q<HTMLElement>(".sheet").forEach((sheet) => {
      const media = Array.from(sheet.querySelectorAll<HTMLElement>(".sheet-media"));
      const title = sheet.querySelector<HTMLElement>(".sheet-title");
      const meta = Array.from(sheet.querySelectorAll<HTMLElement>(".sheet-meta"));

      const tl = gsap.timeline({ scrollTrigger: { trigger: sheet, start: "top 72%", once: true } });

      tl.fromTo(
        media,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, stagger: 0.12 }
      );

      if (title) {
        tl.fromTo(
          title,
          { yPercent: 112, fontVariationSettings: '"opsz" 14, "wght" 340' },
          { yPercent: 0, fontVariationSettings: '"opsz" 72, "wght" 440', duration: 1.2 },
          0.12
        );
      }

      if (meta.length) {
        tl.fromTo(
          meta,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 },
          0.3
        );
      }

      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
      cleanups.push(() => tl.kill());

      /* Hover opens the title a little wider while the lens sits on the media. */
      const link = sheet.querySelector<HTMLElement>("a");
      if (title && link) {
        const enter = () =>
          gsap.to(title, { fontVariationSettings: '"opsz" 72, "wght" 540', duration: 0.7 });
        const leave = () =>
          gsap.to(title, { fontVariationSettings: '"opsz" 72, "wght" 440', duration: 0.7 });
        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointerleave", leave);
        });
      }
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div ref={root}>
      {/* ------------------------------- hero ------------------------------- */}
        <section className="page-x relative isolate overflow-hidden flex h-[100svh] flex-col justify-between pt-[var(--spacing-page)] pb-[calc(var(--spacing-page)+2.5rem)]">
        <HeroReveal src="/matheen-hero.webp" />
        <HeroField />
        <div />

        <div>
          <h1
            ref={heroTitle}
            className="hero-title type-mega invisible"
            style={{ fontVariationSettings: '"opsz" 72, "wght" 430' }}
          >
            <span className="block">Matheen</span>
            <span className="block">Bukhari</span>
          </h1>
          <a
            href="https://wdawards.com/web/matheen-bukhari"
            target="_blank"
            rel="noopener noreferrer"
            className="md:absolute md:right-[var(--spacing-page)] md:top-[18svh]"
          >
            <img
              src="/media/wd-award-nominee-dark.svg"
              alt="WD Award Nominee"
              className="h-[80px] w-auto mt-6 md:mt-0 md:h-[25svh]"
            />
          </a>
        </div>

        <div ref={heroMeta} className="grid grid-cols-12 items-end gap-[var(--spacing-gutter)]">
          <p className="type-lead col-span-12 measure md:col-span-5">
            Creative direction, design and digital for premium property brands across the UK, the
            Gulf and Asia.
          </p>
          <p className="type-micro col-span-7 md:col-span-3 md:col-start-8">
            Twenty years — Bangalore, Dubai, Manchester
          </p>
          <p className="type-micro col-span-5 text-right md:col-span-2">Six selected projects</p>
        </div>
      </section>

      {/* ------------------------------ sheets ------------------------------ */}
      {PROJECTS.slice(0, 6).map((project, i) => {
        const flip = i % 2 === 1;
        return (
          /* Flex column, not an absolute band: the title row reserves its own
             height, so media can never run underneath it at any window size. */
          <article
            key={project.slug}
            className="sheet page-x relative flex h-[100svh] w-full flex-col pt-[13svh] pb-[calc(var(--spacing-page)+3rem)] md:pb-[calc(var(--spacing-page)+1.75rem)]"
          >
            <a
              href={`/work/${project.slug}`}
              data-cursor="view"
              onClick={(e) => {
                e.preventDefault();
                openProject(
                  router,
                  `/work/${project.slug}`,
                  e.currentTarget.querySelector<HTMLElement>(".sheet-media-poster")
                );
              }}
              /* items-stretch + min-h-0: both columns inherit the row height,
                 so neither depends on a percentage or on image aspect ratio. */
              className="grid min-h-0 flex-1 grid-cols-12 grid-rows-1 items-stretch gap-[var(--spacing-gutter)]"
              aria-label={`${project.title} — open case study`}
            >
              <div
                data-speed="0.94"
                className={`sheet-media sheet-media-poster row-start-1 min-h-0 ${
                  flip
                    ? "col-span-12 md:col-span-5 md:col-start-8"
                    : "col-span-12 md:col-span-5 md:col-start-1"
                }`}
              >
                <MediaGL
                  src={project.poster}
                  alt={`${project.title} — ${project.summary}`}
                  className="h-full w-full"
                  priority={i === 0}
                />
              </div>

              {/* Detail + one-line read. Hidden on phones, where the poster and
                  the title already fill the screen. */}
              <div
                data-speed="1.1"
                /* row-start-1 is load-bearing: on flipped sheets this column
                   sits to the LEFT of the poster but comes after it in source
                   order, and grid auto-placement never moves backwards — it
                   would drop the column into an implicit second row, where its
                   height is auto and the flex-1 image collapses to zero. */
                className={`hidden min-h-0 flex-col justify-center md:flex md:row-start-1 ${
                  flip ? "md:col-span-4 md:col-start-1" : "md:col-span-4 md:col-start-9"
                }`}
              >
                <div className="sheet-media w-full" style={{ aspectRatio: "16/9" }}>
                  <MediaGL
                    src={project.still ?? project.poster}
                    alt={`${project.title} — detail`}
                    className="h-full w-full"
                    interactive={false}
                  />
                </div>
                <p className="sheet-meta mt-4 max-w-[36ch] shrink-0 text-graphite">
                  {project.summary}
                </p>
              </div>
            </a>

            <div className="mt-5 flex shrink-0 items-end justify-between gap-4 md:gap-8">
              
              <div className={`min-w-0 flex-1 ${flip ? "text-left" : "text-right"}`}>
                <div className="overflow-hidden pb-[0.2em]">
                  <h2
                    className="sheet-title type-mega whitespace-nowrap"
                    style={{
                      fontSize: "5.5vw",
                      fontVariationSettings: '"opsz" 72, "wght" 440',
                    }}
                  >
                    {project.title}
                  </h2>
                </div>
                <p className="sheet-meta type-micro mt-2">
                  {project.categories.join(" / ")} — {project.place} {project.year}
                </p>
                <p className="sheet-meta mt-3 text-graphite md:hidden">{project.summary}</p>
              </div>
            </div>
          </article>
        );
      })}

      <Contact />
    </div>
  );
}
