"use client";

import { useRef } from "react";
import { gsap, revealHeading, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import MediaGL from "@/components/MediaGL";
import Contact from "@/components/Contact";
import { accents } from "@/lib/text";

const CAPABILITIES = [
  ["Direction", "Creative direction, art direction, brand and visual identity, design systems"],
  ["Campaigns", "Campaign concepts, photography and film direction, CGI supervision, social and email"],
  ["Digital", "Websites, multilingual and RTL builds, CMS, technical SEO, accessibility, analytics"],
  ["Print", "Brochures, floor plans, sales collateral, presentations, event and environmental graphics"],
  ["Tools", "AI-assisted production systems, briefing and audit platforms, internal product design"],
  ["Delivery", "Design teams across three regions, agency and freelance management, creative governance"],
];

const HISTORY = [
  ["2024—", "Creative Manager", "Select Property", "Dubai"],
  ["2017—24", "Senior Digital Designer", "Select Property", "Dubai"],
  ["2012—17", "Senior Web Designer", "Emaar Entertainment", "Dubai"],
  ["2011—12", "Senior Designer", "Juma Al Majid Group", "Dubai"],
  ["2009—11", "Web Designer", "ITP Publishing Group", "Dubai"],
  ["2006—09", "Senior Web / Graphic Designer", "UAE Experts", "Dubai"],
  ["2005—06", "Graphic/ Web Designer", "Scepter Communications", "Bangalore"],
];

export default function InfoPage() {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useIsoLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const cleanups: Array<() => void> = [];

    if (title.current) cleanups.push(revealHeading(title.current, { delay: 0.1 }));

    if (!prefersReducedMotion()) {
      const rows = Array.from(scope.querySelectorAll<HTMLElement>(".info-row"));
      rows.forEach((row) => {
        const tween = gsap.fromTo(
          row,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          }
        );
        cleanups.push(() => tween.revert());
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={root}>
      <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] pt-[26svh] pb-[12svh]">
        <h1
          ref={title}
          className="type-mega-sm invisible col-span-12 md:col-span-10"
          style={{ fontVariationSettings: '"opsz" 72, "wght" 430' }}
        >
          {accents("20+ years directing brands, and building the systems that *hold them together*.")}
        </h1>

        <div className="info-row col-span-12 mt-[8svh] md:col-span-5">
          <div className="aspect-[4/5] w-full">
            <MediaGL src="/media/matheen-bukhari.webp" alt="Matheen Bukhari" className="h-full w-full" />
          </div>
        </div>

        <div className="info-row col-span-12 mt-[8svh] space-y-6 md:col-span-6 md:col-start-7">
          <p className="type-lead measure">
            I am Matheen Bukhari, a creative manager based in Dubai. I lead a design team across the
            UK, the Gulf and China, and I still build the things I direct.
          </p>
          <div className="measure space-y-5">
            <p>
              My work sits where creative direction meets delivery. Brand and campaign thinking on
              one side, websites, email and production systems on the other. Most of it has been for
              property, retail and entertainment, where a launch date is fixed and the work has to be
              right the first time.
            </p>
            <p>
              I started in publishing, which is where I learned to produce at speed without letting
              quality slip. Five years at Emaar Entertainment followed, running the digital presence
              for Dubai Aquarium, Reel Cinemas, Dubai Ice Rink and their neighbours, each with its own
              audience inside one group identity. Since 2017 I have been at Select Property,
              first as a senior designer and now leading creative across the UK, the Gulf and Asia.
            </p>
            <p>
              The part I have spent the last few years on is the part nobody photographs. Design
              systems, asset libraries, briefing workflows, automated audits. When three regions want
              the same design resource in the same week, the answer is rarely more oversight. It is
              usually better systems and fewer things done by hand. So I build them, and I keep a
              person on the approval before anything ships.
            </p>
            <p>
              I care about typography, about how fast a page loads, and about whether the sales team
              can actually use what we made.
            </p>
          </div>
        </div>
      </section>

      <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] border-t border-hairline py-[10svh]">
        <h2 className="type-micro col-span-12 mb-8 text-graphite md:col-span-3">What I do</h2>
        <dl className="col-span-12 md:col-span-8 md:col-start-5">
          {CAPABILITIES.map(([term, detail]) => (
            <div
              key={term}
              className="info-row grid grid-cols-12 gap-[var(--spacing-gutter)] border-b border-hairline py-6 first:border-t"
            >
              <dt
                className="type-h2 col-span-12 md:col-span-4"
                style={{ fontVariationSettings: '"opsz" 40, "wght" 440' }}
              >
                {term}
              </dt>
              <dd className="col-span-12 md:col-span-8">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] border-t border-hairline py-[10svh]">
        <h2 className="type-micro col-span-12 mb-8 text-graphite md:col-span-3">Where</h2>
        <ul className="col-span-12 md:col-span-8 md:col-start-5">
          {HISTORY.map(([years, role, company, place]) => (
            <li
              key={`${years}-${role}`}
              className="info-row grid grid-cols-12 gap-[var(--spacing-gutter)] border-b border-hairline py-5 first:border-t"
            >
              <span className="type-micro tnum col-span-3 pt-1 text-graphite md:col-span-2">
                {years}
              </span>
              <span className="col-span-9 md:col-span-4">{role}</span>
              <span className="col-span-6 text-graphite md:col-span-4">{company}</span>
              <span className="type-micro col-span-6 pt-1 text-right text-graphite md:col-span-2">
                {place}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Contact />
    </div>
  );
}