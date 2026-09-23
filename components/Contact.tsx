"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, revealHeading } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { accents } from "@/lib/text";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const title = self.selector?.(".contact-title")[0] as HTMLElement | undefined;
      if (title) {
        revealHeading(title, { scrollTrigger: { trigger: title, start: "top 80%" } });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      className="page-x flex min-h-[92svh] flex-col justify-between bg-stage py-[var(--spacing-page)] text-paper"
    >
      <div className="type-micro flex justify-between pt-[8svh] text-paper/60">
        <span>Currently in Dubai, working across GMT+4 and GMT</span>
        <span>Open to creative lead and consulting work</span>
      </div>

      <h2
        className="contact-title type-display invisible max-w-[18ch]"
        style={{ fontVariationSettings: '"opsz" 60, "wght" 420' }}
      >
        {accents("Creative direction. *AI-enabled* production.")}
      </h2>

      <div className="grid grid-cols-12 items-end gap-[var(--spacing-gutter)]">
        <div className="col-span-12 flex flex-wrap gap-x-10 gap-y-3 md:col-span-7">
          <a
            href="mailto:bukhari.matheen@gmail.com"
            data-cursor="link"
            className="type-h2 border-b border-paper/30 pb-1 transition-colors hover:border-ochre hover:text-ochre"
          >
            bukhari.matheen@gmail.com
          </a>
        </div>
        <nav className="type-micro col-span-12 flex items-center gap-8 md:col-span-5 md:justify-end">
          <a href="https://www.linkedin.com/in/matheen-bukhari" data-cursor="link" className="hover:text-ochre">
            LinkedIn
          </a>
          <Link href="/work" data-cursor="link" className="hover:text-ochre">
            Work
          </Link>
          <Link href="/info" data-cursor="link" className="hover:text-ochre">
            Info
          </Link>
          <a
            href="https://wdawards.com/web/matheen-bukhari"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/media/wd-award-nominee-white.svg"
              alt="WD Award Nominee"
              className="h-[100px]"
            />
          </a>
        </nav>
        <p className="type-micro col-span-12 pt-10 text-paper/40">
          2026 - MATHEEN BUKHARI
        </p>
      </div>
    </footer>
  );
}
