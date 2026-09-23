# Matheen Bukhari — portfolio, design direction

## Subject
Creative Manager / creative director with 20+ years across premium property marketing in the
UK, GCC and Asia. Audience: heads of marketing, founders and creative directors hiring a
creative lead in Dubai or London. Job of the site: prove range (websites, campaigns, identity,
film, print) and taste inside 60 seconds, then let a hiring manager go deep on one project.

## Where the visual language comes from
Not "agency portfolio" in general — the material world Matheen actually works in: architectural
drawing sets, show-home sales galleries, site hoardings, plan and elevation sheets, concrete,
sand, glass. So: paper-grey stock, slab-like horizontal structure, sheet numbering that is a real
sequence (projects are ordered), and one warm mineral accent instead of a bright UI accent.

## Colour
| token | hex | role |
| --- | --- | --- |
| `--paper` | `#D6D3CC` | base — dry plaster grey, cooler and heavier than the usual cream |
| `--paper-lift` | `#E4E1DA` | raised sheets, cards, hovered rows |
| `--ink` | `#14161A` | all primary type |
| `--graphite` | `#6B6862` | secondary type, rules, meta |
| `--stage` | `#000000` | true black, only for full-bleed media stages |
| `--ochre` | `#B0762A` | live state only: cursor dot, scroll progress, active filter |

Deliberately avoided: cream + serif + terracotta, black + acid green, SaaS cards with one
radius and a grey shadow. Radius is 0 everywhere except the cursor, which is the only round
thing on the site — that is the whole point of it.

## Type
Two families with clearly separated jobs. **Newsreader** (variable: `opsz 6–72`, `wght 200–800`,
true italic) takes every headline; **Archivo** (`wght 100–900`, `wdth 62–125`) takes body copy and
all UI chrome. The contrast is the point — a bookish serif against a neutral grotesk reads as
editorial rather than as a tech product.

The optical-size axis is the signature: headlines enter at `opsz 14` (text cut — sturdy, open
joints) and settle to `opsz 72` (display cut — finer hairlines, tighter fit) as they reveal. It is
a gesture you feel more than see, and it is something only a variable font can do. Italic is the
second voice: wrap a phrase in `*asterisks*` in the content and it renders as a true italic, not a
slanted roman. The width axis survives in one place — the `/work` filter labels, which widen on
hover — because that is chrome, and chrome stays on the grotesk.

Scale (ratio ≈ 1.5, clamped): 12 / 14 / 16 / 21 / 34 / 55 / 89 / 144px.
Body copy capped at 62ch. Sentence case everywhere except the fixed UI chrome
(`INDEX`, `OPEN`, `CLOSE`, `VIEW`) which is caps because it is instrumentation, not content —
this matches the reference and is the one place caps earn their keep.

## Layout
Index — full-viewport sheets, side alternating so the eye crosses the page:

    ┌────────────────────────────────────────────┐
    │ MB—CD                                 INFO │
    │  ┌──────────────┐                          │
    │  │  tall media  │        ┌─────────┐       │
    │  │  (WebGL)     │        │ still   │       │
    │  │              │        └─────────┘       │
    │  └──────────────┘   OPEN                   │
    │  01                    MERIDIAN QUARTER →  │
    └────────────────────────────────────────────┘

Case study — pinned split, then the whole page hands off to a black stage:

    [ hero: title at 144px, wdth reveal ]
    [ media column scrolls │ text column frozen ]   ← 3 stepped positions
    [ ——— page drops to stage ——— ]
    [ full bleed ][ split pair ][ overlap ][ horizontal gallery ]

Work — categories as a sticky left index in large condensed type with real counts; grid on the
right re-lays out with GSAP Flip so filtering is a single continuous movement, never a re-render
flash.

## Principles
1. Spend the boldness on one thing: the width-axis type. Everything else is quiet.
2. Motion must answer an action — hover, click, scroll position. No ambient float.
3. Every structural device carries information: sheet numbers are a sequence, counts are real,
   the progress read-out is the actual scroll position.
4. Reduced motion is a first-class path: no Lenis, no WebGL, no pins, no split reveals.
