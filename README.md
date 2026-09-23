# Matheen Bukhari — portfolio

An animated portfolio built to the reference direction (thomasmonavon.com) but with its own
visual language. Next.js 16 App Router, TypeScript, Tailwind v4, GSAP, Lenis, React Three Fiber.
All content is placeholder — see "Swapping in real content" below.

Read `DESIGN.md` first; it explains the palette, the type system and why the choices were made.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build — all routes prerender statically
npm run typecheck
```

Deploy to Vercel: push the repo, import it, no configuration needed. Every route is static.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Load sequence, hero, six full-viewport project sheets, contact |
| `/work` | Category filter index + project grid |
| `/work/[slug]` | Case study — pinned split, stage hand-off, galleries |
| `/info` | Bio, capabilities, history |

## How each interaction is built

**Load sequence** (`components/Preloader.tsx`) — eight tiles enter on alternating axes while the
counter runs 000–100 and the word "Index" opens its width axis; the grid then closes up and the
whole sheet lifts away. Runs once per session (`sessionStorage`), force-completes after 6s if the
tab is backgrounded, and is skipped entirely under reduced motion.

**Cursor lens blur** (`components/MediaGL.tsx`) — a custom shader on a 40×40 plane. Fourteen
golden-angle taps blur only within ~0.44 of the cursor, with a shallow vertex bulge, a hair of
chromatic separation and a 4.5% zoom on hover. Uniforms are lerped frame-rate independently.
Canvases mount only when the media is within 15% of the viewport, and the component falls back to
a plain `<img>` (which always carries the alt text) with no WebGL or with reduced motion.

**Custom cursor** (`components/Cursor.tsx`) — reads the nearest `data-cursor` attribute, so any
element can set the state without React wiring: `view`, `drag`, `close`, `link`, `hide`. Uses
`mix-blend-difference`, so it inverts correctly over both paper and the black stage. Hidden on
touch devices.

**Sheet motion** (`components/IndexExperience.tsx`) — per-sheet timeline: media wipes up via
`clip-path`, the title rises from a mask while `wdth` opens 74 → 108, meta fades in behind it.
Poster and detail move at different `data-speed` rates. Hovering a sheet widens the title to 122.

**Route hand-off** (`lib/transition.ts`) — the clicked poster is cloned into a body-level layer and
grown to full bleed while the route pushes. The case study opens on the same asset, so the cut
lands on a matching frame. There is a hard 2.2s cleanup so the layer can never be orphaned.

**Case study** (`components/CaseStudy.tsx`)
1. Full-bleed hero, scrubbed scale, scrims top and bottom so the chrome holds on any image.
2. The frozen split: the media reel scrolls on the left while the editorial column is `position:
   sticky` on the right. Three stepped positions, with a "Now showing" read-out that updates from
   ScrollTrigger as each frame passes the reading line.
   *This uses sticky + scroll position rather than hijacking the wheel with `Observer`. It gives
   the same stepped feel while scroll stays native — trackpads, touch and keyboard all behave, and
   it degrades cleanly. If you want the literal "three wheel events then jump", swap the sticky
   block for `Observer` with `onUp/onDown` and a step counter.*
3. The hand-off: as the stage enters, chapter one lifts, scales to 0.955 and fades — the page
   appears to move down and reveal the black stage underneath.
4. Stage: full-bleed plate, split pair with opposing drift, an overlapping pull quote, then a
   pinned horizontal gallery (`DRAG` cursor), then outcome numbers that count up.

**Work filtering** (`components/WorkIndex.tsx`) — GSAP Flip captures every card's position, the
list swaps, and Flip carries the survivors to their new slots while entering and leaving cards
scale in and out. `grid-auto-flow: dense` keeps the rows packed. Filter labels widen on hover.

## Responsive behaviour

Checked at 390×844 (phone), 820×1180 (tablet portrait), 1280×620 (short laptop window) and
1440×900. Two rules make it hold:

- **No absolute positioning for anything that carries content.** Index sheets are a flex column —
  media row (`flex-1`) above a title row that reserves its own height — so the title can never
  land on top of an image regardless of window proportions. This was a real bug at short window
  heights.
- **`svh` everywhere, never `vh`**, so mobile browser chrome appearing and disappearing doesn't
  push content off screen.

Per breakpoint: phones drop the sheet's detail image and move the project summary under the
title; the `/work` filters become a sticky scrollable row pinned under the header instead of a
sticky column; the case-study split stacks and the pinned horizontal gallery becomes a native
snap-scrolling row (it can't pin without a wheel); the custom cursor and all hover states are
inert on touch, so nothing depends on them.

## Reduced motion

`prefers-reduced-motion: reduce` turns off Lenis, the preloader, WebGL, every scroll trigger, the
pinned rail and the split reveals. Content renders in its final state — verified.

## Swapping in real content

- **Copy and projects** — `lib/projects.ts`. One `Project` object per case study. `reel` must hold
  exactly three items (they are the three stepped positions). `gallery` needs four, `strip` four
  or more.
- **Categories** — the `CATEGORIES` array in the same file drives the filter list and the counts,
  which are computed, not typed in.
- **Imagery** — replace the files in `public/media`. They are procedurally generated placeholders
  (`scripts/gen_media.py`); delete that script once real photography is in. Portrait posters
  around 1200×1600, wides 1920×1080. Consider `next/image` once the real assets land — the WebGL
  path needs a raw URL, so keep `MediaGL` as-is for the hero media and use `next/image` for
  anything static.
- **Contact details** — `components/Contact.tsx` (email is a placeholder; the LinkedIn URL is real).

## Notes

- GSAP 3.13+ ships all plugins, including SplitText and ScrollTrigger, under its standard licence.
  Check the current terms at gsap.com before commercial deployment.
- `scripts/preview.sh` boots the production build and screenshots it with Playwright — useful for
  reviewing layout changes. `W=390 H=844 bash scripts/preview.sh "/::0::m-home"` for mobile,
  `REDUCED=1` for the reduced-motion path.
- Headless Chromium throttles `requestAnimationFrame` unpredictably, which is why the preloader
  has a force-complete failsafe. Keep it: a backgrounded tab can stall the same way.

## Changing the typefaces

Two families, two jobs. **Newsreader** (variable: optical size 6–72, weight 200–800, true italic)
carries every headline; **Archivo** carries body copy and all UI chrome. Both are self-hosted via
`next/font/local`, so there is no external request and no layout shift.

Italic accents: wrap a phrase in `*asterisks*` anywhere in `lib/projects.ts` and it renders as a
true italic — e.g. `"Selling a building that *does not exist yet*."` The helper is `lib/text.tsx`.

To swap in a different serif:

1. `npm i @fontsource-variable/<name>` (or drop a `.woff2` straight into `app/fonts/`).
2. Copy the woff2 files from `node_modules/@fontsource-variable/<name>/files/` into `app/fonts/`.
3. Point the `newsreader` block in `app/layout.tsx` at the new files.
4. In `app/globals.css`, update `--font-serif` and check the `font-variation-settings` in
   `type-mega`, `type-display`, `type-h2` and `type-accent` — axis names differ between fonts
   (`opsz` won't exist on every serif; drop it and use `wght` alone if so).
5. If the new font has no optical-size axis, edit the `widen` tween in `lib/gsap.ts` — it animates
   `opsz` as headlines settle into place.

Good variable serifs with real italics: Newsreader, Fraunces (has a `SOFT`/`WONK` axis for more
character), Literata, Source Serif 4, EB Garamond. For the sans, Archivo can be swapped the same
way — but keep a width axis if you want the filter labels on `/work` to keep widening on hover.

## Hosting on Hostinger (or any shared/cPanel host)

The site has no server-side code — every route prerenders — so it can be exported to plain HTML,
CSS, JS and images and uploaded to shared hosting. Verified working.

1. Uncomment the two lines in `next.config.ts` (`output: "export"` and `images: { unoptimized: true }`).
2. `npm run build` — this writes an `out/` folder (~9MB with the placeholder imagery).
3. Upload the **contents** of `out/` into `public_html` via Hostinger's File Manager or FTP.

Caveats for static export: no Next.js image optimisation (the site uses plain `<img>` so nothing
is lost), no API routes or server actions (none used), and the dev server is still how you work
locally. Keep the export lines commented while developing.

If instead you deploy to Vercel, leave the config as it ships — no export needed, and you get
image optimisation and preview deploys.
# portfolio-website
