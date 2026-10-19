# Verification — October 19, 2026

Tested on Node 22.22.2 with installed Google Chrome against Vite's production preview server.

| Check                      | Result                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency installation    | Passed; npm audit reported zero vulnerabilities at install time                                                                                                      |
| TypeScript                 | `npm run typecheck` passed                                                                                                                                           |
| ESLint                     | `npm run lint` passed                                                                                                                                                |
| Production build           | `npm run build` passed                                                                                                                                               |
| Playwright                 | **46 passed, 2 skipped in 19.5 seconds**                                                                                                                             |
| Viewports                  | Desktop 1440 × 1000; tablet 820 × 1180; mobile 390 × 844 with touch emulation                                                                                        |
| Images                     | All rendered images decoded, including the approved original diagram; no failed asset responses                                                                      |
| Console                    | No browser console errors or uncaught page errors in checked flows                                                                                                   |
| Responsive layout          | No horizontal document overflow at tested sizes                                                                                                                      |
| Accessibility              | No axe WCAG 2 A/AA or WCAG 2.1 AA violations in the default page at all three sizes                                                                                  |
| Keyboard                   | Skip link, content editing, drag pickup/drop/cancel, screenshot and diagram dialogs, focus restoration                                                               |
| Asset boundary             | Portfolio runtime, reviewed product screenshots, fictional artwork and one explicitly approved documentation image; no original source/config/history or source maps |
| Original diagram integrity | Deployed asset SHA-256 equals read-only original: ea3e017366fc3466290112b1ccc5959a1a947a4159e9106a07609d5650ec07f5                                                   |
| Original production source | Remains unmodified                                                                                                                                                   |

The two skipped cases are the touch-specific test in desktop/tablet projects. Real browser touch events passed in the mobile project.

## Checked behavior

- Full builder sequence at all three sizes: default example; add/edit heading; nested section and paragraph; reorder; remove; confirm JSON/preview synchronization; validate/apply edited JSON; syntax and structure errors; preserve last valid page; reset and verify exact restoration.
- Additional image asset/alt/caption edits, references, nested sections, removal of an active parent, selection and destination cleanup.
- Inline properties: selecting or adding a block reveals its own highlighted property editor directly beneath its row; verified on desktop/tablet/mobile. Pointer tests check upper/lower-half insertion, a single unlabeled insertion line, unchanged list height at drag start, synchronized JSON order, and drops inside empty sections. Desktop and mobile authoring captures visually reviewed.
- Mouse and keyboard dragging at all three sizes; mobile touch dragging. Complete subtree movement preserves IDs and descendants. Cross-container nesting, unnesting, cancellation, focus restoration and draft locking work. Tree operations reject cycles/invalid destinations. The same runtime validator protects depth and schema constraints on applied moves.
- Validation rejects unknown bundles/keys, wrong types, missing children, unsupported heading levels, unsafe media URLs, invalid reference items, duplicate IDs, and size/depth/count violations.
- Original article diagram loads at 1980 × 7240, scrolls with keyboard input, opens a native modal, focuses its close button, closes with Escape and returns focus. Original-resolution link is available.
- Local navy/blue/gold palette and responsive screenshots reviewed; production imagery stays separately attributed.
- Adjustable workspace: Compose collapse/restore, side-by-side and vertically stacked output, pointer/keyboard divider sizing, min/max limits, individual and overall layout reset, auto stacking at narrow widths, and preservation of visual edits and pending JSON drafts. Minimum-height checks keep JSON actions and the phone within their panels. Collapsed and stacked views pass axe checks at all three viewport sizes; desktop captures visually reviewed.

## Evidence and limits

The user explicitly approved including `article_diagram_screenshot.png` in the deployable portfolio on October 19, 2026. It is included unchanged and labeled as original documentation. All other internal documentation imagery remains outside public output. A supplied screenshot with a named presenter remains excluded.

This is an independent web reconstruction, not clinical validation of the native application. Demo media uses local images; no clinical calculation or rule is reproduced. Demo edits reset on reload. Source summaries explain mechanisms without distributing original proprietary implementation. Public app-store links provide context, not proof of individual ownership or how later releases were deployed.

Automated checks do not replace assistive-technology testing or a complete browser/device matrix. Safari, Firefox, physical devices, clinical rules and external app-store uptime were not end-to-end tested. No site was published.

## Content studio refinement

The final studio has a compact title/disclaimer header with icon-and-text reset actions. Compose collapses from its upper-right icon into a full-height 48px labeled rail, with keyboard focus restored to the corresponding control. Output has one state-aware, tooltip-equipped layout icon shared by Inspect and Preview. Default and reset layouts put Preview above JSON, with a 48% / 52% split. Narrow workspaces enforce that same order and disable unavailable side-by-side mode.

The studio is capped at 100dvh (100vh fallback); workspace scrolling happens below its header. Scroll-aware dragging, sticky headers, reset placement, icon names, tooltip state, rail height, mounted editor preservation and draft state were tested. The mobile preview renders a fixed 390 × 844 canvas with uniform scale, fitting its pane and using a smaller cap in stacked mode. Tests confirm its aspect ratio and containment through long content, internal scrolling, collapse and layout changes. Desktop and mobile captures were reviewed.

Final complete suite: 46 passed, 2 skipped. The skipped cases remain the touch-only scenario on desktop and tablet projects; mobile touch passed. Both deployable and source archives were refreshed and checked for integrity and allowed asset boundaries.

## Final editorial refinement

Revised the product history, first-person ownership, architectural tradeoffs,
calculator explanation, visual captions, impact and reflection. The modernization
context and contributions come from the contributor’s final brief. Calculator
mechanics were checked against the screen dispatch, all four native components,
math helpers and original documentation (see EVIDENCE.md).

Type checking, linting and the production build passed. The complete Chrome
suite passed again: 46 tests, with the same two touch-only skips on desktop and
tablet. The responsive/image/console/accessibility checks were also rerun against
the final build after the source-caption and metadata edits. Screenshots and
architecture diagrams were preserved. Builder logic, interactions and styling
were not changed; one test locator follows the revised reflection heading.

## Mobile Compose and full-width studio

The studio now has a 740px minimum height capped by the viewport height, and
its section has a full-width blue background with aligned content and no outer
studio border. At 650px and below, output fills the workspace and Compose opens
in a native modal. Header actions use 44px icon buttons with accessible names
and native tooltips. The modal locks background scrolling, cycles keyboard
focus, supports Escape, restores trigger focus, and includes status/error
feedback. Controlled content, selection and JSON drafts survive close/reopen
and breakpoint changes.

The expanded full browser suite passed: **47 passed, 7 skipped**. Two skips
remain the desktop/tablet touch scenario. The other five are desktop pane
scenarios replaced on mobile by the modal workflow; the full modal authoring
and JSON scenario runs in all three projects. Mouse/keyboard/touch dragging,
inline properties, empty-section drops, viewport bounds, phone proportions,
images, console and accessibility checks passed. The modal workflow and touch
and responsive checks were rerun after adding feedback inside the modal.
Mobile output and Compose screenshots were visually reviewed. Type checking,
linting and the final production build passed. Changes remain local; no push.

## Hero contrast and integrated article explanation

The hero and its summary use a full-width navy surface, followed by the plain
white overview section; the site header is unchanged. Article evidence and the
recreated content model now share one figure. The original image renders at its
full aspect ratio with no internal scroll frame. Repeated prose beneath the
figure was integrated into the model annotations. The original asset is
unchanged, and enlargement, Escape and focus restoration remain available.

Type checking, linting and the production build passed. The complete browser
suite passed again: **47 passed, 7 expected skips in 20.2 seconds**. Tests verify
full image height, a single integrated model, white overview surface, image
loading, console output, responsive overflow, accessibility and the existing
studio flows. Desktop hero/article captures were visually reviewed. No commit
or push was made for these refinements.

## Floating navigation and desktop spacing

The site header stays at the viewport top, slides away on downward page scroll,
and returns on upward scroll. A 10px direction threshold avoids jitter, and
keyboard focus reveals the links. Near the page top it remains visible.
Reduced-motion preferences disable the transition. Passive scroll events are
batched with requestAnimationFrame and cleaned up on unmount.

The complete suite passed: **50 passed, 7 expected skips in 21.4 seconds**.
Header tests cover downward hiding, small-scroll tolerance, upward reveal,
keyboard access, top restoration, unchanged height and reduced motion across
all three viewport sizes. Type checking, linting and the production build passed.
The desktop article figure also received more internal padding, a larger gutter
and a narrower explanation column; its full-height diagram and enlargement
checks were rerun after that adjustment. Nothing was committed or pushed.

## Final architecture and contextual header verification — October 19, 2026

The portfolio was reorganized into typed content definitions, feature models/hooks, named composition slots, reusable CMS renderers and shared Radix overlay/action components. Colocated component styles replace the accumulated monolithic stylesheet. `ARCHITECTURE.md` describes ownership and extension workflows.

The contextual header uses the same definitions as the actual eleven case-study sections. It shows the active number/label, provides Overview and Explore the renderer links, and exposes a numbered Sections dropdown with active indication. Tests cover IntersectionObserver section tracking, document progress, header clearance, downward hiding/upward reveal, jitter tolerance, keyboard reveal, pinning while open, arrows/Home/End/Escape, dismissal and focus restoration without page displacement. Mobile navigation and reduced-motion behavior are included.

Final checks:

- Clean dependency installation: `npm ci --offline --no-audit` completed.
- `npm run typecheck`, `npm run lint`, `npm run build` and `git diff --check` passed.
- Production-build Playwright suite in local Google Chrome: **59 passed, 7 expected skips**, across desktop (1440 × 1000), tablet (820 × 1180) and mobile (390 × 844, touch). Seven skips are two non-touch projects and five desktop-only scenarios covered instead by the mobile modal workflow.
- Existing complete visual/JSON/preview workflows, validation, recursive nesting, mouse/touch/keyboard dragging, cycle protection, layout resizing, fixed device proportions, mobile Compose, image loading, console checks and automated accessibility checks passed. The mobile Compose test additionally checks styled field height and vertical label layout after the dialog portal refactor.
- Final desktop/mobile header, studio and mobile Compose screenshots were visually reviewed. Review caught and corrected ancestry-dependent field styles before the final run.

`dist/` contains the static production build and remains ignored by Git. Original production source and private workspace resources were not modified or added. Public evidence assets and the approved original article diagram are unchanged. Browser checks cover Chrome at the listed sizes; they are not a claim of testing every browser or assistive technology. No push or deployment was performed.

## Navigation label styling follow-up

Section headings, current reading location and dropdown destinations now share `SectionLabel`, using the existing editorial eyebrow treatment: gold number, slash, uppercase concise label and matching typography/letter spacing. Section content and builder behavior are unchanged. Type checking, linting and production build passed; all **9 reading-header browser checks** passed across desktop, tablet and mobile, including computed-style comparisons against section 01. Desktop/mobile dropdown captures were visually reviewed.

## Dynamic navigation editorial reduction

Replaced the large four-row regional navigation diagram with a compact three-step flow: menu records → region/language selection → supported native screens. Removed its enclosing blue panel and shortened repeated prose while retaining the documented regional example, source reference, screenshot provenance and application-code boundary. Other diagrams and the interactive builder are unchanged. Type checking, linting, production build and **15 case-study/navigation browser checks** passed across desktop, tablet and mobile, including images, console, accessibility and active-section tracking. Responsive section captures are saved with the ignored browser artifacts.

## Inline citation authoring

Added an Insert citation control to paragraph properties. It inserts positive reference numbers at the textarea cursor/selection using the original `<sup>1,2</sup>` string convention. Shared `CitedText` converts only numeric superscripts into React elements; arbitrary HTML remains literal escaped text. The nested default paragraph demonstrates citation 1. References remain a separate ordered block, with numbering managed by the author rather than automatically resolved IDs or links. The hero label now reads JSON - TYPESCRIPT as requested.

Type checking, linting and production build passed. Full browser suite: **62 passed, 7 expected skips** across desktop, tablet and mobile. New scenarios cover insertion position, cursor focus restoration, invalid number feedback, multiple citations, nested rendering, References entries, JSON application, escaping unsupported markup, accessibility and reset. Existing drag, layout, JSON and reading-header checks passed. Original production source remains unchanged.

## Final narrative, ownership and public evidence revision

The reading sequence now places the unchanged Content studio at section 03, immediately after the architectural decision/pipeline. The original implementation, approved article diagram, collections/navigation, tools and production evidence follow it. All eleven section IDs remain stable; numbering, dropdown order and active labels now follow the revised definitions. The hero’s primary action is Explore the content studio.

The opening identifies the contributor’s Bounteous frontend role. Ownership includes the proposed native renderer, JSON contracts, reusable components, authoring examples/documentation, calculator interfaces, Okta employee sign-in frontend and favorites/local app state. Okta tenant setup remains outside that scope; downloaded article caching is described as a verified broader product feature without individual attribution. The outcomes section replaces repeated deliverables with healthcare-professional, author and developer benefits plus a compact public-evidence list. `PUBLIC_RESEARCH.md` records primary sources and omitted claims. The new custom navy/gold SVG favicon is served locally.

Checks:

- Type checking, linting, formatting and production build passed; `git diff --check` is clean.
- Final full production-build Chrome suite: **62 passed, 7 expected device-specific skips in 25.9 seconds**, across desktop, tablet and mobile. Existing authoring, citations, nesting, dragging, JSON validation/reset, pane controls, mobile modal and preview tests passed.
- Navigation assertions verify the new exact section order, sequential numbers, hero studio target, active-section labels, progress and heading clearance. Responsive checks verify local favicon response/content type, all page images, console output, accessibility and primary evidence-link destinations.
- Public source URLs were opened independently during research. Store pages support the facts displayed; no production login or install was performed. The unverified reviews query URL was replaced with the accessible Apple listing containing those reviews.
- Desktop hero/impact and mobile impact captures were visually reviewed. Original approved diagram hash remains unchanged. No studio implementation, clinical formula, original production code or authentic screenshot was modified. No dependency was added.

Changes are local only. The static build is in ignored `dist/`; no push, deployment or external publication was performed.

## Compact footer evidence and scroll-direction correction

Moved the external product evidence out of Impact and into the footer’s evidence slot. Three compact columns become stacked rows on mobile. Shortened copy retains verified release context, mixed feedback, source links and the distinction between lifetime distribution and individual contribution. The audience impact explanation stays in the main narrative. PublicEvidence styles are colocated with the component.

Fixed persistent header visibility after navigation: retained link focus previously pinned it via both a focus-within CSS override and a scroll-hook condition. Focus can now reveal the header once for keyboard access, but subsequent downward scrolling hides it; upward scrolling and the page top reveal it. An open Sections dropdown still keeps it visible. A regression assertion verifies actual offscreen position while a header link retains focus.

Type checking, linting and production build passed. All **15 case-study/reading-navigation browser checks passed** at desktop, tablet and mobile sizes, covering footer placement/links, images, console, accessibility, section tracking, focus, transitions and scroll direction. Desktop/mobile footer screenshots were visually reviewed. No builder or source-evidence assets changed. Local commit only; no push.

## Screenshot-led tools, footer band and machine-readable case study

Section 08 now explains calculator purpose and personal frontend ownership with short copy and authentic AKI/checklist captures already present in the portfolio. A reusable EvidenceScreenshot opens the shared image dialog. Native details/summary controls reveal compact calculator/checklist flows and source previews. The business benefit is shared implementation and practical utility within the reference app; no measured adoption, time savings or clinical outcome is inferred. Calculator formulas remain provided dependencies. Checklist behavior is described without extending unconfirmed personal ownership.

The footer now places public history/sources first on a full-bleed pale-blue surface, followed by attribution and Back to top. Its content remains aligned to the existing column, with stacked mobile items.

The static build now writes the full case-study narrative into the initial HTML through React DOM Server, then hydrates the same App. A StudioIsland boundary renders a clearly labeled reconstruction summary during server rendering/hydration before mounting the unchanged browser editor. The content model, validation, dragging and preview logic are unchanged. Metadata and generated plain-text companions explicitly separate Tyler Tessmann’s original contributions, team ownership, private source and the fictional web demo. No proprietary implementation or clinical math was added.

Verification:

- Type checking, linting and production build passed, with no added dependency. The build loader uses middleware mode with WebSockets disabled and requires no listening server.
- Full production-build Chrome suite: **74 passed, 7 expected skips in 28.6 seconds** across desktop, tablet and mobile. Existing studio, JSON, citations, drag, responsive, accessibility, images and console tests passed. Source-preview tests now account for the additional checklist reference and open its calculator disclosure before interaction.
- New checks verify tools screenshots/enlargement/focus/disclosures, no-JavaScript reading, initial response content and structured attribution, plain-text routes, robots output and deployment-URL validation. No hydration console errors occurred in the existing responsive checks.
- A build with a reserved example SITE_URL verified canonical URL, social URL, sitemap and robots linkage. A clean default build restored the final artifacts with URL-specific fields omitted. The actual deployment address remains undecided.
- Desktop/mobile tools and the new footer screenshots were visually reviewed. Original production screenshots and the approved documentation image are unchanged. The build is deployable static output; no backend or production CMS access is required.

Search/agent discoverability is supported through readable HTML, semantic metadata and plain text, without a guarantee that any search engine or agent will index or use it. No push or deployment was performed.
