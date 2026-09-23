/**
 * Portfolio content.
 *
 * HOW TO USE THIS FILE
 * Copy here is written, not placeholder. What is deliberately absent is
 * numbers: no outcome blocks are filled in, because a metric you cannot
 * evidence in an interview is worse than no metric at all. Add them from
 * GA4 or Search Console when you have them, or leave them out.
 *
/* ------------------------------------------------------------------ */
/* Taxonomy                                                            */
/* ------------------------------------------------------------------ */

export const CATEGORIES = [
  "Brand & Identity",
  "Websites & Digital",
  "Campaigns",
  "Property & Sales Collateral",
  "Events & Environments",
  "AI & Creative Tools",
] as const;

export const TAGS = [
  "Art direction",
  "Brand identity",
  "Design system",
  "Web design",
  "Front-end build",
  "CMS",
  "Multilingual",
  "RTL / Arabic",
  "Email",
  "Social",
  "Paid media",
  "Presentations",
  "Print",
  "Brochures",
  "Floor plans",
  "Signage",
  "Photography",
  "CGI",
  "Motion",
  "SEO",
  "Accessibility",
  "Analytics",
  "Automation",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Tag = (typeof TAGS)[number];

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type MediaItem = {
  src: string;
  alt?: string;
  aspect?: string;
  /** Layout hint used by the case-study composer. */
  kind?: "full" | "split" | "portrait" | "inset";
  caption?: string;
  /** Thumbnail shown while a video loads (poster frame). */
  poster?: string;
};

/** Exactly three — the stepped positions in the pinned split. */
export type Reel = [MediaItem, MediaItem, MediaItem];

export type Outcome = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  place: string;
  categories: Category[];
  tags?: Tag[];

  /** One line, shown on the index sheet and in the work grid. */
  summary: string;
  /** Editorial headline that opens the case study. */
  brief: string;
  body: string[];
  role: string[];
  credits?: string;
  /** Omit entirely rather than publish a number you cannot evidence. */
  outcome?: Outcome[];

  poster: string;
  still?: string;
  wide?: string;
  reel?: Reel;
  gallery?: MediaItem[];
  strip?: MediaItem[];

  note?: string;
  points?: string[];

  link?: string;
  /** Pulls the project to the top of the work grid. */
  featured?: boolean;
  /**
   * Work produced in-house that may be covered by employer IP or
   * confidentiality terms. Check your contract before flipping this to false.
   */
  restricted?: boolean;
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const PROJECTS: Project[] = [
  {
    slug: "one-port-st",
    title: "One Port Street",
    client: "Select Property",
    year: "2025",
    place: "Manchester",
    categories: ["Brand & Identity", "Websites & Digital", "Property & Sales Collateral"],
    tags: ["Art direction", "Web design", "Brochures", "CGI", "Photography"],
    featured: true,
    summary:
      "Launch identity, website and sales collateral for a rental development in Manchester's Northern Quarter.",
    brief:
      "A rental building in the Northern Quarter, presented the way you would present *somewhere to live* rather than a tenancy.",
    body: [
      "One Port Street sits in the Northern Quarter, and that address does a lot of the selling. The audience is renting rather than buying, which changes the questions entirely — what is available, what does it cost this month, how soon can I move, what is actually on my doorstep. None of that is served by leading with amenity photography.",
      "So the site leads with the apartments. Availability, layouts and monthly pricing sit high on the page, where somebody deciding whether to book a viewing can reach them in a single scroll. The atmosphere works underneath that rather than in front of it, and the neighbourhood is treated as part of the offer instead of a closing paragraph.",
      "I ran the creative direction across the whole launch rather than the website alone: the art direction and photography and CGI briefs, the brochure and print collateral the leasing team carry into viewings, and the digital campaign assets pointing back at the site. Everything came from one set of masters, so the building reads the same whether somebody meets it on Instagram, in a brochure or at the door.",
    ],
    role: ["Creative direction", "Art direction", "Web design", "Sales collateral"],
    note: "Judged on viewings booked, not impressions served",
    points: [
      "Availability and monthly pricing above atmosphere",
      "Leasing collateral and site built from one set of masters",
      "The Northern Quarter treated as the headline, not a footnote",
    ],
    link: "https://oneportst-manchester.com/",
    poster: "/media/ops/poster.webp",
    still: "/media/ops/still.webp",
    reel: [
      { src: "/media/ops/i1.webp", alt: "One Port Street homepage" },
      { src: "/media/ops/i2.webp", alt: "Apartment availability and pricing" },
      { src: "/media/ops/i3.webp", alt: "Booking a viewing" },
    ],
    gallery: [
      { src: "/media/ops/wide.webp", alt: "One Port Street building", kind: "full" },
      { src: "/media/ops/gallery1.webp", alt: "Apartment interior", kind: "split" },
      { src: "/media/ops/gallery2.webp", alt: "Communal space", kind: "split" },
      { src: "/media/ops/gallery3.webp", alt: "Northern Quarter setting", kind: "full" },
      { src: "/media/ops/social.mp4", alt: "Social campaign film", kind: "split" },
      { src: "/media/ops/social.webp", alt: "Social campaign frames", kind: "split" },
    ],
    strip: [
      { src: "/media/ops/slide8.webp", alt: "Campaign artwork" },
      { src: "/media/ops/slide1.webp", alt: "Brochure spread" },
      { src: "/media/ops/slide2.webp", alt: "Apartment photography" },
      { src: "/media/ops/slide3.webp", alt: "Floor plan" },
      { src: "/media/ops/slide4.webp", alt: "Print collateral" },
      { src: "/media/ops/slide5.webp", alt: "Digital campaign unit" },
      { src: "/media/ops/slide6.webp", alt: "Interior detail" },
      { src: "/media/ops/slide7.webp", alt: "Building exterior" },
    ],
  },
{
    slug: "pulse",
    title: "SEO Pulse",
    client: "Select Property",
    year: "2026",
    place: "UK / GCC / Global",
    categories: ["AI & Creative Tools", "Brand & Identity", "Websites & Digital"],
    tags: ["Automation", "SEO", "Analytics", "Design system", "Web design"],
    featured: true,
    restricted: true,
    summary:
      "A named, branded SEO intelligence product for the marketing team, running on an automated pipeline that reports itself every month.",
    brief:
      "SEO reporting nobody reads is not a reporting problem. It is a *product* problem.",
    body: [
      "The monthly SEO picture existed. It lived in spreadsheets and Drive folders the marketing team had to go looking for, and nobody went looking. The work was being done and the decisions it should have informed were being made without it.",
      "Pulse turns that output into something people open. A pipeline collects Search Console and analytics data, competitor movement and page-level authority change each month, and writes the results where the dashboard can read them. Eight views sit on top: hero metrics, meta title and description recommendations with inline status and notes, technical audit findings, blog drafts, content gap briefs, competitor monitoring, an authority tracker showing month-on-month position change, and link opportunities.",
      "The design decision I would defend hardest is the least technical one. Every piece of output has a copy button. The team works in WordPress and LinkedIn, and one click to copy is the difference between a tool used monthly and a tool opened once. Density over decoration throughout, because this is something people scan on a Monday, not something they admire.",
      "It is a product rather than a script, and that was deliberate. It has a name, a tagline, a logo lockup and its own colour system, with a fixed sidebar and card layout. Built in plain JavaScript on serverless functions with invite-only access, without a framework, so it stays readable and easy to hand to somebody else.",
    ],
    role: ["Strategy", "Product design", "UX", "Architecture", "Build"],
    note: "Built for the five minutes a week it actually gets",
    points: [
      "Eight views, from hero metrics to link opportunities",
      "Reads Search Console and analytics data on a monthly cycle",
      "Tracks competitor movement, then says what to do about it",
    ],
    poster: "/media/pulse/poster.webp",
    still: "/media/pulse/still.webp",
    reel: [
      { src: "/media/pulse/i1.webp", alt: "Pulse dashboard overview" },
      { src: "/media/pulse/i2.webp", alt: "Meta recommendations view" },
      { src: "/media/pulse/i3.webp", alt: "Authority tracker" },
    ],
    gallery: [
      { src: "/media/pulse/wide.webp", alt: "Pulse dashboard", kind: "full" },
      { src: "/media/pulse/gallery1.webp", alt: "Report view", kind: "split" },
      { src: "/media/pulse/gallery2.webp", alt: "Competitor monitoring", kind: "split" },
      { src: "/media/pulse/gallery3.webp", alt: "Pulse identity", kind: "full" },
    ],
    strip: [
      { src: "/media/pulse/slide1.webp", alt: "Dashboard detail"},
      { src: "/media/pulse/slide2.webp", alt: "Content brief view" },
      { src: "/media/pulse/slide3.webp", alt: "Technical audit view" },
    ],
  },

  {
    slug: "select-property",
    title: "Select Property",
    client: "Select Property",
    year: "2022",
    place: "Manchester / Dubai / Hong Kong",
    categories: ["Websites & Digital", "Brand & Identity"],
    tags: ["Web design", "CMS", "SEO", "Front-end build", "Analytics", "Accessibility"],
    featured: true,
    summary:
      "The group's corporate site - the front door for a property investment business operating across the UK, the Gulf and Asia.",
    brief:
      "A corporate site with two jobs at once: *build confidence*, and sell apartments.",
    body: [
      "selectproperty.com carries the whole group — who the business is, the developments it has delivered, the investment case behind them, and the routes into a sales team spread across Manchester, Dubai, Hong Kong and Shanghai. Every campaign eventually points here, which means it has to do the trust-building and the selling in the same visit.",
      "The work pulled the developments and the investment proposition forward and cut the corporate throat-clearing that had accumulated around them. Live and completed developments, guides and market content now sit on one structure, so anyone in sales can send a link to anything without writing an explanation around it first.",
      "I have owned the creative and technical delivery of this estate rather than handing it over at launch: design, build direction, the CMS structure the marketing team works in daily, and the continuing SEO, schema and performance work. Most of what I know about structured data, Core Web Vitals and search behaviour in this sector came out of running this site over several years rather than from a course.",
    ],
    role: ["Creative direction", "Web design", "Build oversight", "SEO", "Ongoing ownership"],
    note: "A site I have run for years, not launched and left",
    points: [
      "Developments and investment case ahead of corporate narrative",
      "One structure across developments, guides and market content",
      "Schema, performance and search work maintained continuously",
    ],
    link: "https://selectproperty.com",
    poster: "/media/sp/poster.webp",
    still: "/media/sp/slide1.webp",
    reel: [
      { src: "/media/sp/i1.webp", alt: "Select Property homepage" },
      { src: "/media/sp/i2.webp", alt: "Development listing" },
      { src: "/media/sp/i3.webp", alt: "Investment guide" },
    ],
    gallery: [
      { src: "/media/sp/wide.webp", alt: "Select Property site", kind: "full" },
      { src: "/media/sp/gallery1.webp", alt: "Development page", kind: "split" },
      { src: "/media/sp/gallery2.webp", alt: "Content template", kind: "split" },
      { src: "/media/sp/gallery3.webp", alt: "Group brand application", kind: "full" },
      { src: "/media/sp/social.mp4", alt: "Brand film", kind: "split" },
      { src: "/media/sp/social.webp", alt: "Social frames", kind: "split" },
    ],
    strip: [
      { src: "/media/sp/slide1.webp", alt: "Homepage detail" },
      { src: "/media/sp/slide2.webp", alt: "Development index" },
      { src: "/media/sp/slide3.webp", alt: "Guide layout" },
      { src: "/media/sp/slide4.webp", alt: "Mobile view" },
      { src: "/media/sp/slide5.webp", alt: "Enquiry journey" },
    ],
  },
  
  {
    slug: "vita-living-circle-square",
    title: "Vita Living, Circle Square",
    client: "Select Property",
    year: "2024",
    place: "Manchester",
    categories: ["Websites & Digital", "Property & Sales Collateral"],
    tags: ["Web design", "CMS", "Multilingual", "SEO", "Front-end build", "Accessibility"],
    featured: true,
    summary:
      "A multilingual launch site for Vita Living at Circle Square, selling into the UK, the Gulf and Asia at the same time.",
    brief:
      "The same building, read in *three languages*, without any of them feeling like the translation.",
    body: [
      "Circle Square is a Manchester development sold simultaneously into three markets that behave nothing alike. A UK buyer wants the area, the spec and the completion date. An investor in the Gulf or Hong Kong wants yield, tenancy demand and what happens after handover. They arrive with different questions, on different devices, in different languages.",
      "The usual approach is to build the English site and translate it afterwards, which is why so many multilingual property sites read like a memo passed through a machine. We structured the content the other way round: one content model, several language versions, each free to carry its own emphasis, all on one CMS and one release cycle. Nothing goes stale in one market because another market was updated first.",
      "I directed the design and ran the build alongside the developer — the layout, the typography, the enquiry journey — and owned the technical half as well: structured data, page performance, accessibility, and the SEO work that decides whether a launch site gets found in the window when it matters.",
    ],
    role: ["Creative direction", "Web design", "Build oversight", "SEO"],
    note: "Three markets, one release cycle",
    points: [
      "One content model behind every language version",
      "Structured data and performance handled at build, not bolted on",
      "An enquiry journey that works for investors and owner-occupiers alike",
    ],
    link: "https://vitaliving-circlesquare.com",
    poster: "/media/vl/poster.webp",
    still: "/media/vl/still.webp",
    reel: [
      { src: "/media/vl/i1.webp", alt: "Vita Living homepage" },
      { src: "/media/vl/i2.webp", alt: "Apartment detail page" },
      { src: "/media/vl/i3.webp", alt: "Enquiry journey" },
    ],
    gallery: [
      { src: "/media/vl/wide.webp", alt: "Circle Square development", kind: "full" },
      { src: "/media/vl/gallery1.webp", alt: "Apartment interior", kind: "split" },
      { src: "/media/vl/gallery2.webp", alt: "Residents' amenity space", kind: "split" },
      { src: "/media/vl/gallery3.webp", alt: "Circle Square neighbourhood", kind: "full" },
      { src: "/media/vl/social.mp4", alt: "Launch campaign film", kind: "split" },
      { src: "/media/vl/social.webp", alt: "Social campaign frames", kind: "split" },
    ],
    strip: [
      { src: "/media/vl/slide1.webp", alt: "Homepage detail" },
      { src: "/media/vl/slide2.webp", alt: "Apartment listing" },
      { src: "/media/vl/slide3.webp", alt: "Language version" },
      { src: "/media/vl/slide4.webp", alt: "Floor plan view" },
      { src: "/media/vl/slide5.webp", alt: "Investment detail" },
      { src: "/media/vl/slide6.webp", alt: "Mobile layout" },
      { src: "/media/vl/slide7.webp", alt: "Gallery view" },
      { src: "/media/vl/slide8.webp", alt: "Enquiry form" },
    ],
  },

  

  {
    slug: "edition",
    title: "Edition Birmingham",
    client: "Select Property",
    year: "2025",
    place: "Birmingham",
    categories: ["Websites & Digital", "Property & Sales Collateral", "Campaigns"],
    tags: ["Web design", "Art direction", "Brochures", "Floor plans", "SEO"],
    featured: true,
    summary:
      "Launch site and sales collateral for a Birmingham development sold to UK and overseas investors.",
    brief:
      "Birmingham asks a question Manchester no longer has to: *why here?*",
    body: [
      "For an overseas investor, Birmingham often needs establishing before the building does. Manchester has years of coverage behind it; Birmingham's case — regeneration, transport, rental demand, the gap between price and yield — still has to be made. The launch had to answer the city before it answered the apartment.",
      "So the site opens wide and narrows: the city, then the location, then the building, then the apartment you would actually reserve. The investment rationale, floor plans and pricing sit on the page rather than behind a form, because an investor comparing three cities will not fill in a form to get the basics.",
      "I led the creative direction and design, ran the build, and produced the collateral the sales team take into meetings — brochures, floor plans and price lists — kept aligned with the site so nothing contradicts itself between a screen and a printed page.",
    ],
    role: ["Creative direction", "Web design", "Build oversight", "Sales collateral"],
    note: "The city's case before the building's",
    points: [
      "Investment rationale on the page, not behind a form",
      "Floor plans and pricing kept current across web and print",
      "One visual language across site, brochure and campaign",
    ],
    link: "https://edition-birmingham.com/",
    poster: "/media/ed/poster.webp",
    still: "/media/ed/still.webp",
    reel: [
      { src: "/media/ed/i1.webp", alt: "Edition Birmingham homepage" },
      { src: "/media/ed/i2.webp", alt: "Investment case section" },
      { src: "/media/ed/i3.webp", alt: "Apartment and floor plan view" },
    ],
    gallery: [
      { src: "/media/ed/wide.webp", alt: "Edition Birmingham development", kind: "full" },
      { src: "/media/ed/gallery1.webp", alt: "Apartment interior", kind: "split" },
      { src: "/media/ed/gallery2.webp", alt: "Building detail", kind: "split" },
      { src: "/media/ed/gallery3.webp", alt: "Birmingham setting", kind: "full" },
      { src: "/media/ed/social.mp4", alt: "Launch campaign film", kind: "split" },
      { src: "/media/ed/social.webp", alt: "Social campaign frames", kind: "split" },
    ],
    strip: [
      { src: "/media/ed/slide1.webp", alt: "Brochure spread" },
      { src: "/media/ed/slide2.webp", alt: "Floor plan" },
      { src: "/media/ed/slide3.webp", alt: "Price list" },
      { src: "/media/ed/slide4.webp", alt: "Campaign artwork" },
    ],
  },

  
  {
    slug: "global-furnovate",
    title: "Global Furnovate",
    client: "Global Furnovate",
    year: "2025",
    place: "Bangalore",
    categories: ["Websites & Digital", "AI & Creative Tools"],
    tags: ["Web design", "Art direction", "CMS", "SEO", "Photography"],
    featured: true,
    summary:
      "A website for a furniture manufacturer selling to interior designers, contractors and developers.",
    brief:
      "A manufacturer's site that shows the *work*, not the factory - *Built with Framer AI*",
    body: [
      "Global Furnovate manufactures furniture for interior projects, and the people buying are designers, contractors and developers rather than the public. That audience is not browsing. They are checking whether the finish quality is there, whether the range covers what a project needs, and whether the company can handle the volume — then looking for someone to talk to.",
      "The site is built around the work itself: ranges and finishes shown properly, project photography given room, and a short route to an enquiry from any page. I kept the manufacturing story brief, because capability matters to this audience only once the work has earned their attention.",
      "Built in Framer so the team can add ranges and swap imagery themselves without waiting on a developer — the right trade for a business that updates its catalogue more often than its structure. I handled the direction, design and build, along with the content structure and on-page SEO.",
    ],
    role: ["Creative direction", "Web design", "Concept", "Framer AI"],
    note: "Built so the team can keep it current themselves",
    points: [
      "Ranges and finishes lead; the factory story sits behind them",
      "An enquiry route from every page",
      "Editable by the client without developer time",
    ],
    link: "https://global-furnovate.framer.website/",
    poster: "/media/gf/poster.webp",
    still: "/media/gf/still.webp",
    reel: [
      { src: "/media/gf/i1.webp", alt: "Global Furnovate homepage" },
      { src: "/media/gf/i2.webp", alt: "Product range page" },
      { src: "/media/gf/i3.webp", alt: "Enquiry page" },
    ],
    gallery: [
      { src: "/media/gf/wide.webp", alt: "Furniture project photography", kind: "full" },
      { src: "/media/gf/gallery1.webp", alt: "Product detail", kind: "split" },
      { src: "/media/gf/gallery2.webp", alt: "Finish detail", kind: "split" },
      { src: "/media/gf/gallery3.webp", alt: "Completed interior", kind: "full" },
      { src: "/media/gf/social.mp4", alt: "Product film", kind: "split" },
    ],
    strip: [
      { src: "/media/gf/slide1.webp", alt: "Range page" },
      { src: "/media/gf/slide2.webp", alt: "Product photography" },
      { src: "/media/gf/slide3.webp", alt: "Interior project" },
      { src: "/media/gf/slide4.webp", alt: "Mobile layout" },
    ],
  },

  {
    slug: "campaign-briefing-platform",
    title: "Campaign Briefing App",
    client: "Select Property",
    year: "2026",
    place: "UK / GCC / Global",
    categories: ["AI & Creative Tools"],
    tags: ["Automation", "Design system"],
    featured: true,
    restricted: true,
    summary:
      "A structured briefing workflow for a marketing team across three regions, replacing briefs that arrived by email, Slack and WhatsApp.",
    brief:
      "Creative teams rarely lose time to the work. They lose it to *everything around the work*.",
    body: [
      "Campaign requests were reaching the team through whatever channel the requester happened to prefer, each one missing something different. Nobody could say who had approved what, or why a brief had changed between Tuesday and Thursday.",
      "The app gives every brief one path. Draft, then an interpretation summary sent back to the requester to confirm the brief was understood as intended, then an approval chain chosen per brief rather than fixed by hierarchy. Any approver can request revisions with a severity rating and comments, which returns the brief to draft. Every action is written to an audit log.",
      "The confirmation step is the part I would defend hardest. Most briefing tools capture what was asked for. This one makes the person who received the brief write down what they think it means, and makes the requester agree before any work starts. Almost every expensive piece of rework I have seen traces back to that conversation not happening.",
      "Built hands-on in Node, Express and PostgreSQL with a deliberately plain front end, on a design system of warm stone, tight letter-spacing, two font weights and a five-pixel radius ceiling. Approved by management, with task-management integration and content review rounds specified for the next phase.",
    ],
    role: ["Product design", "UX", "Design system", "Build"],
    note: "One path per brief, and a name against every decision",
    points: [
      "Interpretation confirmed before work starts",
      "Approval chain chosen per brief, not fixed by hierarchy",
      "Every action written to an audit log",
    ],
    poster: "/media/cb/poster.webp",
    still: "/media/cb/still.webp",
    reel: [
      { src: "/media/cb/i1.webp", alt: "Brief creation screen" },
      { src: "/media/cb/i2.webp", alt: "Interpretation summary" },
      { src: "/media/cb/i3.webp", alt: "Approval chain" },
    ],
    gallery: [
      { src: "/media/cb/wide.webp", alt: "Briefing app dashboard", kind: "full" },
      { src: "/media/cb/gallery1.webp", alt: "Brief detail view", kind: "split" },
      { src: "/media/cb/gallery2.webp", alt: "Revision request", kind: "split" },
      { src: "/media/cb/gallery3.webp", alt: "Audit log", kind: "full" },
    ],
    strip: [
      { src: "/media/cb/slide1.webp", alt: "Interface detail" },
      { src: "/media/cb/slide2.webp", alt: "Approval view" },
      { src: "/media/cb/slide3.webp", alt: "Design system" },
    ],
  },

  {
    slug: "check-voters-list",
    title: "VoterList Search Tool",
    client: "Self Experiment",
    year: "2025",
    place: "India",
    categories: ["Websites & Digital", "AI & Creative Tools"],
    tags: ["Web design", "Art direction", "CMS", "SEO", "Photography"],
    featured: true,
    summary:
      "Search hundreds of names for the one that's yours — instantly.",
    brief:
      "Voters searching for their own name in an electoral roll faced a wall of *scanned PDFs* that no browser could search.",
    body: [
      "The Election Commission publishes rolls constituency by constituency, but each file is an image, not text, often running hundreds of pages, and set in whichever regional script that constituency uses. Someone looking for their name had no option but to scroll page by page, squinting at scanned print in a script they might not even read comfortably.",
      "VoterListCheck.in turns that scroll into a search box. A voter uploads the PDF locally in their browser, the script is detected automatically, and OCR runs across it in whichever of thirteen Indian languages the document is set in. Matches return as a structured table, name, relation, house number, age, gender, with a page-image viewer so the result can be checked against the original scan. Nothing leaves the device: no upload to a server, no stored file, no backend at all.",
      "Built entirely client-side in plain HTML, CSS and JavaScript, running pdf.js for rendering and Tesseract.js for OCR, on a calm civic palette of deep blue and warm orange. Shipped as a self-contained static site with full SEO infrastructure, blog content, schema, sitemap, and deployed to production hosting.",
    ],
    role: ["Creative direction", "Web design", "OCR pipeline", "SEO & content"],
    note: "Built so the team can keep it current themselves",
    points: [
      "Ranges and finishes lead; the factory story sits behind them",
      "An enquiry route from every page",
      "Editable by the client without developer time",
    ],
    link: "https://voterlistcheck.in/index.html",
    poster: "/media/vo/poster.webp",
    still: "/media/vo/still.webp",
    
    gallery: [
      { src: "/media/vo/wide.webp", alt: "Furniture project photography", kind: "full" },
      { src: "/media/vo/gallery1.webp", alt: "Product detail", kind: "full" },
      { src: "/media/vo/i1.webp", alt: "Product detail", kind: "full" },
      { src: "/media/vo/i2.webp", alt: "Product detail", kind: "full" },
      { src: "/media/vo/social.mp4", alt: "Product film" },
    ],
    strip: [
      { src: "/media/vo/slide1.webp", alt: "Range page" },
      { src: "/media/vo/slide2.webp", alt: "Product photography" },
      { src: "/media/vo/slide3.webp", alt: "Interior project" },
      { src: "/media/vo/slide4.webp", alt: "Mobile layout" },
    ],
  },

    {
    slug: "dubai-aquarium",
    title: "Dubai Aquarium & Underwater Zoo",
    client: "Emaar Entertainment",
    year: "2016",
    place: "Dubai",
    categories: ["Websites & Digital", "Brand & Identity"],
    tags: ["Web design", "Front-end build", "Art direction", "CMS"],
    featured: true,
    summary:
      "Website and ticket booking experience for one of Dubai Mall's most visited attractions, as part of the in-house UI/UX team.",
    brief:
      "A ticket people buy in a queue, on a phone, with *thirty seconds of patience*.",
       body: [
      "Back in 2016, most visitors were buying on a phone, often already inside Dubai Mall, deciding between a single aquarium ticket and a combo with another Emaar attraction. That audience is not browsing. They are standing somewhere, deciding quickly, and the flow had to survive thirty seconds of patience.",
      "The work started with the operations team rather than with a design brief. They were flagging. Guests arriving with the wrong ticket type, queues at the counter for changes, combo confusion, date errors, whichever it actually was. I designed the concept, the flow and the interface around solving that, then worked alongside the in-house development team through implementation to make sure what shipped still answered the problem we started with.",
      "Conceptualisation, design and HTML/CSS build of the site, developed on Bootstrap and built responsive for a mobile-heavy visitor audience. One of five consumer leisure brands within Emaar Entertainment, each with its own audience inside a single group identity.",
    ],
    role: ["Concept", "UX design", "UI design", "Front-end build"],
    note: "As shipped 2016. The site has been rebuilt since.",
    points: [
      "Booking flow designed for a phone, in a mall, in a hurry",
      "Combo and single-ticket decision made on one screen",
      "One of five Emaar Entertainment brands on a shared identity",
    ],
    link: " https://www.thedubaiaquarium.com/tickets/book-tickets/",
    poster: "/media/da/poster.webp",
    still: "/media/da/still.webp",
    reel: [
      { src: "/media/da/i1.webp", alt: "Ticket date selection" },
      { src: "/media/da/i2.webp", alt: "Visitor and ticket type selector" },
      { src: "/media/da/i3.webp", alt: "Cart and checkout summary" },
    ],
    gallery: [
      { src: "/media/da/wide.webp", alt: "Image", kind: "full" },
    ],
  },

];

/* ------------------------------------------------------------------ */
/* Work index                                                          */
/* ------------------------------------------------------------------ */

export type WorkItem = {
  slug?: string;
  title: string;
  client: string;
  year: string;
  categories: Category[];
  image: string;
  ratio: "portrait" | "landscape" | "square";
};

/**
 * Lighter entries — grid presence without a full case study behind them.
 * These still need real images; each one currently points at a placeholder.
 */
const ADDITIONAL: WorkItem[] = [
  {
    title: "Vita Student",
    client: "Select Property",
    year: "2022",
    categories: ["Websites & Digital", "Campaigns"],
    image: "/media/vita.webp",
    ratio: "landscape",
  },
  {
    title: "Reel Cinemas",
    client: "Emaar Entertainment",
    year: "2014",
    categories: ["Websites & Digital", "Campaigns"],
    image: "/media/reel.webp",
    ratio: "square",
  },
  {
    title: "Arabian Business",
    client: "ITP Publishing Group",
    year: "2010",
    categories: ["Websites & Digital"],
    image: "/media/ab.webp",
    ratio: "portrait",
  },
  {
    title: "ITP Awards & Events",
    client: "ITP Publishing Group",
    year: "2010",
    categories: ["Events & Environments", "Campaigns"],
    image: "/media/itp.webp",
    ratio: "landscape",
  },
];

export const WORK: WorkItem[] = [
  ...PROJECTS.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    client: p.client,
    year: p.year,
    categories: p.categories,
    image: p.poster,
    ratio: (i % 3 === 1 ? "landscape" : "portrait") as WorkItem["ratio"],
  })),
  ...ADDITIONAL,
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Display index, derived from position. Never hand-maintain these. */
export function projectIndex(slug: string): string {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return i < 0 ? "" : String(i + 1).padStart(2, "0");
}

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function nextProject(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return PROJECTS[0];
  return PROJECTS[(i + 1) % PROJECTS.length];
}

export function prevProject(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return PROJECTS[0];
  return PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
}

export function workByCategory(category: Category | "All") {
  if (category === "All") return WORK;
  return WORK.filter((w) => w.categories.includes(category));
}

export const FEATURED = PROJECTS.filter((p) => p.featured);

/** Hides empty filters so the bar never offers a dead end. */
export const CATEGORY_COUNTS = CATEGORIES.map((c) => ({
  name: c,
  count: WORK.filter((w) => w.categories.includes(c)).length,
})).filter((c) => c.count > 0);