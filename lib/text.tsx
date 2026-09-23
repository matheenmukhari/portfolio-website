import { Fragment, type ReactNode } from "react";

/**
 * Wrap any phrase in *asterisks* in the content files and it renders as a true
 * italic in the serif — the second voice in a headline. Keeps `lib/projects.ts`
 * plain strings rather than JSX.
 *
 *   "Selling a building that *does not exist yet*."
 */
export function accents(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="italic">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
