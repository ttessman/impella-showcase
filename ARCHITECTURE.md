# Portfolio architecture

The code follows the case study's architectural intent: content definitions and
contracts describe what is possible; reusable renderers and layouts own how it
appears; feature composition connects those pieces to interaction state.

## Responsibility and dependency direction

| Layer                       | Responsibility                                                   | Examples                                                     |
| --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| Application                 | Assemble providers and product features                          | `app/App.tsx`                                                |
| Content                     | Author narrative, evidence and illustrative definitions          | `content/caseStudy.ts`, `diagrams.ts`, `sourceExamples.ts`   |
| Contracts                   | Describe shared content and editorial shapes                     | `types/content.ts`, `caseStudy.ts`, `sourceReference.ts`     |
| Feature composition         | Declare the experience and its slots                             | `CaseStudyPage`, `ContentStudio`                             |
| Feature hooks/models        | Own editor state, commands, validation and tree operations       | `useContentEditor`, `useWorkspaceLayout`, `parseContentPage` |
| Shared renderers/primitives | Render content and handle presentation/interaction mechanics     | `CMS`, `Dialog`, `PreviewPopover`, `ResizableSplit`          |
| Browser hooks               | Measure elements, observe reading position and manage disclosure | `useElementSize`, `useReadingPosition`, `usePreviewPopover`  |

Shared components do not import feature state. Features pass content, definitions,
slots and runtime callbacks into them. Content modules can import shared types,
but do not depend on rendering implementations. Component prop types stay with
the component; shared domain contracts live under `types/`.

## Slots and state

`ContentStudio` declares toolbar, compose, inspect, preview and feedback slots.
`ContentStudioLayout` and `StudioWorkspace` own placement, resizing, collapsing
and mobile modal presentation. They receive a layout controller; they do not
implement content mutations or JSON validation.

`useContentEditor` owns the last valid page, selection, destination and JSON draft.
Its commands validate mutations before applying them. A pending JSON draft locks
visual mutations until applied or discarded. Stable IDs and immutable tree
operations preserve nested content through moves and deletion.

`Dialog` exposes header/actions/body/footer slots and delegates modality, focus containment
and dismissal to Radix. `ImageDialog` supplies the image-viewing composition used
by both product screenshots and the original article diagram. Mobile Compose
uses the workspace variant of the same dialog frame. The standard variant is used by checklist, reader and image views. The frame owns a fixed header with right-aligned actions, a keyboard-focusable scrolling body and an optional fixed footer. Features supply slot content and size constraints rather than recreating the frame. Escape first cancels an active drag, then dismisses
the dialog on a subsequent press.

`SourceReference` supplies trigger/body/footer content to `PreviewPopover`.
Radix handles anchoring, viewport collision and outside dismissal; the shared
`usePreviewPopover` hook adds hover/focus inspection and click/tap pinning.
`Button` supports Radix Slot's `asChild` composition. Named layout slots remain
explicit typed React nodes; Radix Slot handles element-level composition.

## Content rendering

`ContentView` iterates authored blocks in order. `BundleRender` dispatches the
bundle discriminator to Heading, Text, Media, Section or References components.
Sections recurse through `ContentView`. Each leaf receives a narrowed block type.
Unsupported runtime bundles receive a safe fallback; untrusted JSON must pass
`parseContentPage` before becoming editor state. Strings render through React,
without injected HTML.

The rendering vocabulary follows the original project where useful. This is an
independently written web demonstration: generic sections, local image records,
heading levels and stricter validation are portfolio extensions.

## Editorial composition and navigation

`content/caseStudy.ts` owns section IDs, numbers, labels, headings and copy.
`CaseStudyPage` composes the narrative using those definitions. `CaseStudyNavigation`
uses that same catalog for context and the section dropdown. It adds no duplicate
numbering or section titles. The shared `ReadingHeader` exposes identity, context
and action slots and retains scroll-direction visibility.

`useReadingPosition` observes a narrow section activation band below the measured
header. Document progress is updated at most once per animation frame. The global
scroll offset follows the header's measured height. Radix handles the section
popover's dismissal and focus; focus restoration uses `preventScroll` to preserve
the selected destination.

## Styling

Tokens and document-wide typography/focus foundations live in `styles/`.
Presentation rules live beside their owning components and features, including
separate composer, inspector, mobile preview, workspace and toolbar styles.
`styles/index.css` is an explicit import manifest with predictable cascade order.
Class-scoped CSS preserves the existing rendering and accessibility selectors.
No new styling framework or global component theme was introduced.

## Extending the application

- **A supported content type:** extend `types/content.ts`, add its label to
  `blockDefinitions`, defaults to `blockFactory`, runtime validation to
  `parseContentPage`, a leaf under `components/CMS/blocks`, a dispatcher case,
  and its authoring fields. Verify draft application, nesting rules and preview.
- **An evidence image:** add the reviewed local asset and metadata in
  `content/evidence.ts`; use the shared media/image-viewing components.
- **A source preview:** add paths, summary and independently written example in
  `content/sourceExamples.ts`, then compose `SourceReference` at the relevant
  section. Original proprietary implementation remains outside this repository.
- **A case-study section:** add its definition/copy, compose it in `CaseStudyPage`
  and keep the exported catalog in page order. Navigation consumes the same catalog.
- **A shared interaction:** place behavior in a focused browser hook or Radix
  wrapper; provide slots rather than duplicating feature-specific markup.

## Verification

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, then `npm test`.
Playwright checks the production build in desktop, tablet and mobile Chrome.
The suite covers editor commands, malformed JSON, recursion and moves, touch and
keyboard dragging, responsive layouts, modal/popover focus, contextual navigation,
images, console errors and axe accessibility checks.

The original production source remains read-only outside `portfolio/`. This
repository contains neither that implementation nor its credentials or history.

## Inline citations

`TextBlockFields` inserts numeric `<sup>` markers at the textarea selection into the existing `text_body` string contract. Shared `CitedText` recognizes only numeric superscripts and creates React elements; arbitrary HTML remains escaped. The original app rendered richer HTML fragments through its native HTML renderer; this portfolio supports only the citation convention. Source order and inline numbers remain author-managed, with no automatic citation linking or renumbering.

## Narrative and public evidence

Reading order is overview → architectural decision → content studio → implementation → original documentation → collections/navigation → interactive tools → production → impact/evidence → reflection. `sectionDefinitions` follows that order and supplies the numbering/labels used by both page sections and the contextual navigation. Anchor IDs remain stable. The studio is relocated as an intact feature; its model, hooks and renderers are unchanged by the narrative revision.

`content/publicEvidence.ts` stores linked external product facts separately from individual contribution statements and private-repository summaries. `PublicEvidence` renders that compact list through the footer’s evidence slot, with three columns on desktop and stacked items on mobile. Research dates and omissions are documented in `PUBLIC_RESEARCH.md`; externally reported product facts do not become individual performance metrics.

## Build-time reading and hydration

`src/entry-server.ts` renders the same App tree through React DOM Server. `scripts/prerender.mjs` uses Vite’s existing module loader with HTTP middleware mode and WebSockets disabled, then writes the initial HTML and reader companions. No server, browser automation dependency or proprietary reference repository is needed at deployment/build time. All content is local portfolio data.

`StudioIsland` exposes a fixed server/hydration snapshot through `useSyncExternalStore`, then mounts the existing browser-only ContentStudio. This boundary prevents server execution of window-dependent editor hooks while preserving matching hydration markup. The editing model, JSON validation, dragging and renderer are unchanged. The narrative stays visible with JavaScript disabled; interactive controls require JavaScript.

`content/siteIdentity.ts` derives personal role/team text from the same editorial copy and supplies explicit attribution boundaries. `features/CaseStudy/metadata/buildMetadata.ts` creates escaped metadata, JSON-LD and the plain-text outline. Canonical and sitemap fields require an explicit validated SITE_URL. Case-study authorship is modeled separately from Abiomed’s product and the independently written demo.

Tools use `content/toolExperiences.ts` to compose reviewed screenshots, short captions and expandable flow details and compact source references through one reusable EvidenceScreenshot component. The footer places the compact public-evidence slot before attribution, on a blue surface spanning the viewport while preserving the content column.

## Definition-driven cards, checklist and source preview

`components/card/Card` owns the header, content and optional footer regions through named ReactNode slots. Tool definitions compose the shared frame, evidence renderer, disclosure and source footer. CSS Grid stretch and a flexible card content region keep neighboring cards and footer edges aligned. Site-footer styles are scoped independently from article footers.

`content/checklistExample.json` owns every example label, grouped question, option and conditional outcome, including modal copy. `content/checklistExample.ts` adapts the JSON to `types/checklist.ts` with an operator check and compile-time shape checking. The independently written checklistModel evaluates the first matching AND/OR condition or fallback. `useChecklist` owns selected IDs, reset generation and a derived live result; Checklist renders the supplied definition and state. ChecklistDialog connects the controller to shared toolbar reset/close icons and the existing Radix Dialog shell; the generic form remains usable outside a modal. `useClientReady` provides the shared server/client snapshot used by both the modal trigger and StudioIsland.

`SourceReference` composes the reusable PreviewPopover. `SourceCodePreview` renders typed file definitions containing path, context and independent illustration. It owns file selection, roving keyboard focus, horizontal tab scrolling and code scrolling. Content lives in sourceExamples.ts; initialFile can select the most useful implementation rather than its entry point. Tooltip handles hover/focus context and an inline disclosure supports touch. The shared IconButton extends Button with a tooltip and accessible label; its styles live beside the component. Popover close controls reuse that centered icon treatment. No private source links are fabricated.

The footer receives reader and public-evidence slots from App. Attribution precedes the colored evidence band. CaseStudyReader composes Dialog and the definition-driven Document renderer from the same section/ownership data. Its print stylesheet exports only the reading document through the browser’s Print / Save as PDF flow; no prebuilt PDF or external rendering service is required. The plain-text route remains directly available with a no-JavaScript fallback.
