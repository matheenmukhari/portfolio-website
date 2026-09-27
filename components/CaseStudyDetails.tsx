"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import type { DetailSection } from "@/lib/projects";

export default function CaseStudyDetails({ sections }: { sections: DetailSection[] }) {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const scope = root.current;
    if (!scope || prefersReducedMotion()) return;

    const tweens = Array.from(scope.querySelectorAll<HTMLElement>(".detail-row")).map((row) =>
      gsap.fromTo(
        row,
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        }
      )
    );

    return () => tweens.forEach((t) => t.revert());
  }, []);

  return (
    <div ref={root} className="relative z-[2] bg-stage text-paper">
      {sections.map((section, i) => {
        const hasPersonaImages = section.subsections?.some((s) => s.image);

        if (hasPersonaImages) {
          return (
            <section key={section.heading} className="border-t border-paper/15 py-[10svh]">
              <div className="page-x mb-[8svh]">
                <span className="type-micro tnum block text-paper/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  className="type-h2 mt-3"
                  style={{ fontVariationSettings: '"opsz" 40, "wght" 440' }}
                >
                  {section.heading}
                </h2>
                {section.lead && (
                  <p className="detail-row type-lead measure mt-6">{section.lead}</p>
                )}
              </div>

              {section.subsections?.map((sub, j) => (
                <div
                  key={sub.heading}
                  className={j > 0 ? "border-t border-paper/15 pt-[10svh]" : ""}
                >
                  {sub.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={sub.image}
                      alt={sub.heading}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                  <div className="page-x relative z-10 -mt-[2em]">
                    <h3
                      className="detail-row inline-block bg-stage px-8 py-4 text-paper"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(1.75rem, 4vw, 3.6rem)",
                        lineHeight: 1.05,
                        fontVariationSettings: '"opsz" 60, "wght" 440',
                      }}
                    >
                      {sub.heading}
                    </h3>
                  </div>
                  <div className="page-x pb-[10svh]">
                    {sub.body && (
                      <p className="detail-row mt-4 text-paper/75">{sub.body}</p>
                    )}
                    {sub.bullets && (
                      <div className="mt-3">
                        <List items={sub.bullets} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </section>
          );
        }

        return (
          <section
            key={section.heading}
            className="page-x grid grid-cols-12 gap-[var(--spacing-gutter)] border-t border-paper/15 py-[10svh]"
          >
            <header className="detail-row col-span-12 mb-8 md:col-span-3">
              <span className="type-micro tnum block text-paper/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2
                className="type-h2 mt-3"
                style={{ fontVariationSettings: '"opsz" 40, "wght" 440' }}
              >
                {section.heading}
              </h2>
            </header>

            <div className="col-span-12 space-y-8 md:col-span-8 md:col-start-5">
              {section.lead && (
                <p className="detail-row type-lead measure">{section.lead}</p>
              )}

              {section.body?.map((p) => (
                <p key={p} className="detail-row measure">
                  {p}
                </p>
              ))}

              {section.bullets && (
                <List items={section.bullets} numbered={section.numbered} />
              )}

              {section.table && (
                <div className="detail-row overflow-x-auto">
                  <table className="w-full min-w-[34rem] border-collapse text-left">
                    <thead>
                      <tr>
                        {section.table.columns.map((col) => (
                          <th
                            key={col}
                            scope="col"
                            className="type-micro border-b border-paper/15 pb-3 pr-6 font-normal text-paper/40"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")} className="border-b border-paper/15 align-top">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`py-4 pr-6 ${c === 0 ? "" : "text-paper/75"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.subsections && (
                <div className="grid grid-cols-1 gap-x-[var(--spacing-gutter)] gap-y-12 md:grid-cols-2">
                  {section.subsections.map((sub) => (
                    <div key={sub.heading} className="detail-row border-t border-paper/15 pt-6">
                      <h3
                        className="type-h3"
                        style={{ fontVariationSettings: '"opsz" 32, "wght" 460' }}
                      >
                        {sub.heading}
                      </h3>
                      {sub.body && <p className="mt-3 text-paper/75">{sub.body}</p>}
                      {sub.bullets && (
                        <div className="mt-3">
                          <List items={sub.bullets} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.link && (
                <a
                  href={section.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-row type-micro inline-block border-b border-current pb-1"
                >
                  {section.link.label}
                </a>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function List({ items, numbered }: { items: string[]; numbered?: boolean }) {
  return (
    <ul className="detail-row">
      {items.map((item, i) => (
        <li
          key={item}
          className="flex gap-3 border-b border-paper/10 py-1 first:border-t"
        >
          {numbered ? (
            <span className="type-micro tnum mt-[0.2em] shrink-0 text-paper/40">
              {String(i + 1).padStart(2, "0")}
            </span>
          ) : (
            <span
              aria-hidden
              className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-ochre"
            />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
