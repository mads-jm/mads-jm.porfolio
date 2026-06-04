// Career timeline data for the /portfolio spine.
//
// EdgeRunner work is ABSTRACTED on purpose: it is sourced from internal,
// outcome-framed work notes and deliberately omits internal file paths,
// component names, PR/issue numbers, product-confidential format names, and
// any step-by-step security detail. Keep it that way when editing.
//
// Retail/coffee facts come from the 2015–2023 resume. Edit freely; the
// component renders whatever is here. Newest entries first.

export interface Checkpoint {
  id: string
  title: string
  /** One line shown while collapsed. */
  summary: string
  /** Bullets revealed on expand. */
  detail?: string[]
  dateRange?: string
}

export interface CareerEntry {
  id: string
  role: string
  org: string
  dateRange: string
  location?: string
  kind: "work" | "education"
  /** Short line under the header, always visible. */
  blurb?: string
  /** Optional small stat line (e.g. scale signal). */
  stat?: string
  /** Expandable checkpoints. Present for the rich EdgeRunner entries. */
  checkpoints?: Checkpoint[]
}

export interface EduSegment {
  id: string
  degree: string
  org: string
  dateRange: string
  /** Small note shown under the dates. */
  note?: string
  /** Half-open index range [fromIndex, toIndex) into WORK: the work entries
      this education segment runs parallel to. Drives the bracket's vertical
      span so overlap is visible. */
  fromIndex: number
  toIndex: number
}

export const WORK: CareerEntry[] = [
  {
    id: "edgerunner-engineer",
    role: "Machine Learning Engineer",
    org: "EdgeRunner AI",
    dateRange: "Aug 2025 – Present",
    kind: "work",
    blurb:
      "Supporting the engineering team on a local-first desktop AI app, with shipped work across export, rendering, performance, and security.",
    stat: "~50+ shipped issues across roughly 14 months",
    checkpoints: [
      {
        id: "perf",
        title: "Streaming-render performance",
        summary:
          "Worked with a teammate to cut the cost of rendering long streaming responses from quadratic toward linear.",
        detail: [
          "A teammate profiled the streaming hot path and pinpointed the critical areas; we shaped the optimization approach together.",
          "The whole growing message was being re-processed every animation frame, an O(n) per-frame cost that compounds to about O(n²) over a long response.",
          "Removed a duplicated full-content scan that ran twice per frame on identical input.",
          "Added a bounded LRU cache for math rendering keyed on content and display mode, caching failures too so malformed math stops retrying every frame.",
          "Shipped as zero-behavior-change wins: byte-identical output, unchanged streaming pacing.",
        ],
      },
      {
        id: "latex",
        title: "Math rendering parity",
        summary:
          "Made math render identically in the live chat and in every export format, fixing a class of bugs that broke real model output.",
        detail: [
          "Built a math-region-aware text mapper so prose-level rewrites never corrupt content inside math regions.",
          "Unified two divergent rendering pipelines onto shared primitives, closing bugs that previously had to be fixed twice.",
          "Handled messy real-world output: full-document math fences, multi-line math in table cells, display-vs-inline promotion, and consistent equation numbering.",
          "Backed it with a regression suite that caught real defects, and split an oversized module roughly in half.",
        ],
      },
      {
        id: "export",
        title: "Document & chat export pipeline",
        summary:
          "Designed a unified multi-format export pipeline (PDF, Markdown, DOCX, plain text) with a live preview that is byte-identical to the final file.",
        detail: [
          "Built one export service with content caching so the on-screen preview and the exported file come from the same pipeline, guaranteeing parity.",
          "Implemented format-specific rendering from a shared core: PDF theming, DOCX tables with column alignment, citation grouping, and headers and footers.",
          "Added page-size and orientation controls plus print-CSS fixes for wide-table truncation.",
          "Shipped cross-platform: native dialogs on desktop, in-browser ZIP generation for bulk export on web, with per-item progress, cancellation, and partial-failure handling.",
        ],
      },
      {
        id: "archive",
        title: "Portable archive format",
        summary:
          "Owned the client side of a custom binary archive format for exporting and importing chat histories and document collections, including OS-level integration.",
        detail: [
          "Built the import/export UX: drag-and-drop detection, a distinct treatment in the file tree, and streamed import with progress events.",
          "Added an opt-in encryption and signing path, gated on key availability.",
          "Prototyped double-click-to-open file association across Windows, macOS, and Linux, with a single-instance lock that forwards the file to a running window. Someone else built the production version.",
        ],
      },
      {
        id: "security",
        title: "Security hardening",
        summary:
          "Acted on a pre-release security audit of the export and rendering surfaces with defense-in-depth fixes.",
        detail: [
          "Escaped untrusted strings at every sink where content was interpolated into preview HTML, closing injection vectors.",
          "Locked down a privileged file-open path: an allowlist of app-written paths plus canonicalization, rejecting traversal, UNC paths, and non-existent targets.",
          "Ran a systematic review of every live render surface for the same injection class and documented each path's posture.",
        ],
      },
      {
        id: "architecture",
        title: "Architecture migration",
        summary:
          "Supported a tech-lead-owned migration toward a documented style guide: shared design tokens, a reusable primitives layer, and clean package boundaries.",
        detail: [
          "Shared in the team effort to extract reusable primitives (modal, tabs, buttons), retiring duplicated implementations across the app.",
          "Migrated my features onto the centralized token scale, clearing scattered z-index and style literals.",
          "Helped shift context and reducer state toward the new selector-based stores where my work touched it.",
        ],
      },
    ],
  },
  {
    id: "edgerunner-intern",
    role: "ML Engineer Intern",
    org: "EdgeRunner AI",
    dateRange: "May 2025 – Aug 2025",
    kind: "work",
    blurb:
      "Started on scoped UI fixes and grew into owning full features across the frontend and the Python backend.",
    checkpoints: [
      {
        id: "settings",
        title: "Dynamic settings system",
        summary:
          "Built a schema-driven settings system that generates typed, constrained controls from backend metadata and reconciles client- and server-side configuration behind one interface.",
        detail: [
          "Designed a metadata-driven schema that separates values from constraints (type, range, category, restart-required) so the UI builds the right control automatically.",
          "Implemented a library of specialized inputs with optimistic updates and error rollback over a reducer-based model.",
        ],
      },
      {
        id: "apidocs",
        title: "API documentation automation",
        summary:
          "Turned backend API docs into a source-of-truth artifact instead of a manual chore.",
        detail: [
          "Built a single script that exports an OpenAPI spec from the running app, mocking heavy dependencies for CI, validates it, and compiles branded HTML docs.",
          "Documented every endpoint and data model, clearing nearly all validation warnings, and wired a CI workflow that posts validation reports on pull requests.",
        ],
      },
      {
        id: "ux",
        title: "UX correctness & feedback",
        summary:
          "A steady stream of correctness fixes underpinning the bigger features.",
        detail: [
          "Standardized app-wide error handling so previously-silent failures surface as clear user feedback.",
          "Fixed layered UI bugs: portal-based context menus that escape overflow and stacking contexts, tooltip-persistence races, and a last-in-first-out escape-key stack so one keypress closes one overlay.",
          "Built a text sanitation utility so the text-to-speech engine stops reading raw markdown and URLs aloud.",
        ],
      },
    ],
  },
  {
    id: "story-coffee",
    role: "Lead Barista",
    org: "Story Coffee",
    dateRange: "2024 – 2025",
    kind: "work",
    blurb:
      "Led the bar at a specialty shop. Trained new baristas, passed along the craft, and looked after the regulars who made the place. The role that cemented coffee as a lasting love; I'm an at-home enthusiast now.",
  },
  {
    id: "coffee",
    role: "Barista → Lead Barista",
    org: "Starbucks · Queen Bee Cafe",
    dateRange: "2022 – 2023",
    kind: "work",
    blurb:
      "The years coffee taught me people: reading a room, winning someone over, and making an ordinary moment a little better.",
    checkpoints: [
      {
        id: "queen-bee",
        title: "Lead Barista, Queen Bee Cafe",
        summary:
          "Opened and ran a nonprofit cafe with minimal staff (2023).",
        detail: [
          "Put a daily, weekly, and monthly cleaning cadence in place.",
          "Cut scheduled hours about 25% week over week while holding service quality.",
          "Onboarded and trained staff and ran weekly food orders from a home kitchen.",
        ],
      },
      {
        id: "starbucks",
        title: "Barista, Starbucks",
        summary:
          "Where it clicked: connecting with people went from a battle to my bread and butter (2022 – 2023).",
        detail: [
          "I started young and shy. Behind the bar, learning regulars and reading who wanted a chat versus who wanted speed, it fast became the thing I was best at.",
          "Optimized workflow and held a routine while serving a wide variety of drinks and food under pressure.",
        ],
      },
    ],
  },
  {
    id: "cinemark",
    role: "Floor Staff → Theatre Manager",
    org: "Cinemark · Lincoln Square Cinemas",
    dateRange: "2015 – 2021",
    kind: "work",
    blurb:
      "Six years and four promotions, and where I learned to lead. Cinemark's \"one guest at a time\" became how I ran a floor: build a team that cares, and the guest experience follows.",
    checkpoints: [
      {
        id: "theatre-manager",
        title: "Theatre Manager",
        summary: "Manager on duty running daily operations across the building (2021).",
        detail: [
          "Assumed manager-on-duty in the GM's absence, largely running daily operations while the GM oversaw two buildings.",
        ],
      },
      {
        id: "senior-am",
        title: "Senior Assistant Manager",
        summary: "Coordinated a large management and floor team alongside the GM (2019 – 2021).",
        detail: [
          "Delegated and coordinated 12+ assistant managers and 20 to 50 floor staff.",
          "Owned daily floor operations, policy enforcement, and management training.",
          "Contributed to yearly budgeting and monthly reviews; handled escalated guest issues.",
        ],
      },
      {
        id: "assistant-manager",
        title: "Assistant Manager",
        summary: "Operations, cash handling, and staff coaching (2017 – 2019).",
        detail: [
          "Managed a $15,000 safe and over a dozen active registers under strict cash-handling policy.",
          "Trained and coached staff across every theatre job function; prepared admin reports for the GM.",
        ],
      },
      {
        id: "floor-supervisor",
        title: "Floor Staff → Supervisor",
        summary: "Concessions, ticketing, and floor ops at high volume (2015 – 2017).",
        detail: [
          "Served up to several thousand guests a night in a fast-paced environment.",
          "Promoted to supervisor with delegation duties and ownership of individual areas.",
        ],
      },
    ],
  },
]

// Education runs as a parallel lane. Each segment spans the WORK entries it
// overlapped (by index), so the bracket visually proves the years ran concurrent.
// WORK index map: 0 ER-engineer, 1 ER-intern, 2 story-coffee, 3 coffee, 4 cinemark.
export const EDUCATION: EduSegment[] = [
  {
    id: "bs",
    degree: "B.S. Computer Science",
    org: "Bellevue College",
    dateRange: "2023 – 2025",
    note: "After the AA, I shifted everything toward finishing the degree.",
    fromIndex: 1,
    toIndex: 3,
  },
  {
    id: "aa",
    degree: "A.A.S. transfer degree",
    org: "Bellevue College",
    dateRange: "2017 – 2023",
    note: "The long stretch: part-time, fit around full-time work.",
    fromIndex: 3,
    toIndex: 5,
  },
]
