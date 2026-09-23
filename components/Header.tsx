"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/info", label: "Info" },
];

export default function Header() {
  const pathname = usePathname();
  const onCase = pathname.startsWith("/work/") && pathname.split("/").length > 2;

  return (
    <header className="page-x pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between py-[var(--spacing-page)] mix-blend-difference">
      <Link
        href="/"
        data-cursor="link"
        className="type-micro pointer-events-auto text-paper"
        aria-label="Matheen Bukhari — home"
      >
        Matheen Bukhari
      </Link>

      {onCase ? (
        <Link href="/work" data-cursor="link" className="type-micro pointer-events-auto text-paper">
          Index
        </Link>
      ) : (
        <nav className="pointer-events-auto flex gap-[clamp(1rem,2.4vw,2.5rem)]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="link"
              className="type-micro text-paper"
              style={{ opacity: pathname.startsWith(l.href) ? 0.45 : 1 }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
