# Impella — Content, composed natively

An independently written portfolio case study and interactive CMS reconstruction, refactored from `../impella_portfolio_case_study_v4.html`. The original HTML and `../impella-react-native/` production repository remain read-only references and are not needed to build or host this app.

## Setup and commands

Requires Node 22.12+ (tested with 22.22.2) and npm. From this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Dependencies are locked: React 19.3.1, Vite 8.3.4. React and Vite were installed from their latest npm tags on October 19, 2026. TypeScript 6 and ESLint 9 match typescript-eslint's supported peer dependencies.

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
npm test
```

Tests run against the **production build**, so run `npm run build` first. Playwright launches locally installed Google Chrome (`channel: 'chrome'`). If Chrome is unavailable, install it, or run `npx playwright install chromium` and remove the channel setting from `playwright.config.ts`. The test runner starts and stops a preview server on port 4173; keep that port free so it tests this build. Test output and responsive screenshots are written to ignored `test-results/`.

## Structure

- `src/app/App.tsx`: the application shell and shared providers.
- `src/content/`: section definitions, editorial copy, diagram models, evidence metadata, source illustrations and fictional studio assets/examples.
- `src/features/CaseStudy/`: the narrative composition and its contextual navigation.
- `src/features/ContentStudio/ContentStudio.tsx`: composes named toolbar, composer, inspector, preview and feedback slots.
- `src/features/ContentStudio/hooks/`: content editing, JSON draft lifecycle, workspace layout and dragging.
- `src/features/ContentStudio/model/`: validation, block definitions/factories, immutable tree operations and layout defaults.
- `src/types/`: shared content, editorial and source-reference contracts.
- `src/components/CMS/`: ordered ContentView, typed BundleRender dispatch and individual block renderers.
- `src/components/layout/`: reading header, section frame, footer and resizable split.
- `src/components/actions/`: reusable Button and IconButton with Radix Slot composition.
- `src/components/overlays/`: shared Radix dialog, preview popover and tooltip behavior.
- `src/components/media/`: evidence views and one shared image dialog.
- `src/components/source/`: source-specific content composed into the shared popover.
- `src/hooks/`: element measurement, scroll direction, reading position/progress and preview disclosure.
- `src/styles/`: tokens, global foundations and the explicit stylesheet manifest. Component and feature styles are colocated with their owners and scoped by class selectors.
- `public/assets/`: reviewed production screenshots, the approved original article diagram, fictional demo artwork and a custom navy/gold portfolio favicon.
- `tests/*.spec.ts`: scenarios grouped by editor, dragging, workspace, evidence, reading header and source previews; shared interaction helpers live in `tests/helpers/`.

See [ARCHITECTURE.md](ARCHITECTURE.md) for responsibilities, dependency direction, slot APIs and extension workflows.

React/TypeScript is warranted here because recursive editing, synchronized JSON drafts and runtime validation have meaningful state complexity. Vite produces a static deployment; no backend, authentication, external font service or CMS access is needed.

## Demo contract and behavior

The demo uses actual bundle/field vocabulary (`header`, `text_block`, `media`, `references_accordion`, `primary_content_value`) where useful, but **is not the original API schema or original proprietary source**. `demo_section` adds arbitrary recursive composition for teaching. Original article primary blocks are flat; original nested content includes purpose-specific structures such as references containers and checklist question arrays. The demo's image sub-bundle, heading level, bundled image paths and stricter union are independently designed. It renders escaped text with a narrow exception for numeric citation markers such as `<sup>1,2</sup>`, matching the original rich-text citation convention. The Insert citation control adds these at the paragraph cursor. React renders recognized markers as superscripts; all other markup remains literal text, with no direct HTML injection. Authors manually align citation numbers with the ordered References list, as in the original implementation; the demo does not resolve citation IDs or renumber sources automatically.

Add any supported bundle at page root or in a section using the destination selector. Select a block to open its highlighted property editor directly beneath that block; selecting or adding brings its fields into view. Arrows reorder siblings; remove also removes nested children. Drag a grip to reorder blocks or move whole sections between containers. Hover the upper or lower half of a block to insert before or after it. A single blue line indicates the insertion point, without adding labels or shifting the list during dragging. Empty sections provide one clear drop area. Focus a grip and press Space to pick up, use arrow keys/Home/End to choose a position, and press Enter to drop or Escape to cancel. Touch dragging uses pointer capture; arrows remain available. Cyclic moves are blocked, and excessive nesting is rejected without changing the page. Stable IDs preserve selection through reorders. Generated JSON always reflects the last applied page. Editing JSON starts an explicit draft and disables visual mutations. Validate checks it without applying; Apply updates editor and preview atomically; Discard restores the last applied JSON. Reset discards the draft and restores the original working example. There is no persistent storage: refresh also resets the demonstration.

**Content studio** has a 740px minimum height, capped at `100dvh` (`100vh` fallback) on shorter screens. The surrounding section uses one full-width blue background while its content stays aligned with the case study. Its compact header keeps the disclaimer beneath the title and places icon-and-text **Reset layout** / **Reset example** actions together. The workspace scrolls inside the frame; pane headers stay available while scrolling.

Use the tooltip-equipped icon in Compose’s upper-right corner to collapse it into a full-height rail with an expand icon and vertical title. The shared Output header has one state-aware icon that switches between side-by-side and stacked views. **Stacked is the default, with the mobile preview above JSON**, using 48% for preview and 52% for the inspector. Drag dividers to adjust those proportions. A focused divider responds to arrow keys (Shift increases the step), Home/End set limits, and Enter or double-click restores its initial split. Horizontal widths and stacked proportions are remembered separately during the session. **Reset layout** restores the initial view without discarding edits or JSON drafts. Narrow workspaces always keep Preview above JSON. At viewport widths of 650px or less, only output occupies the workspace: Compose opens from an icon button beside the two reset actions. These mobile actions use icons with accessible names and native tooltips. The shared Radix Compose dialog supports Escape, keyboard focus cycling, background scroll locking and focus restoration. It keeps edits, selection and pending JSON drafts across close/reopen and breakpoint changes; status and error feedback are available inside it. Mobile has no Compose rail or redundant output layout button. Unavailable dividers are hidden.

The mobile mockup renders a fixed 390 × 844 canvas and scales it uniformly to fit its available space. Its maximum rendered width is slightly smaller in stacked mode (300px versus 320px side by side). Changing content or panel dimensions cannot stretch the device: content scrolls inside the fixed frame. Desktop layout transitions keep the editors mounted. Mobile/desktop breakpoint changes preserve controlled content, selection and JSON draft state.

Validation rejects unknown bundles and properties, duplicate/invalid IDs, wrong types, missing required fields, unsafe/unbundled media sources and excessive size/depth/count. Errors name the failing field path. Bounds: 100 KB JSON, 100 blocks, 5 section levels, 5,000 characters per string, 30 reference entries. Drafts and invalid changes never replace the last valid page. All image choices are local and nonclinical. References are fictional text, not source links. No calculator or clinical rules are reproduced.

## Reading navigation and source previews

The header shows Impella and the current section number/label. Its Sections dropdown is generated from the same definitions as the page, highlights the active section and supports arrows, Home/End and Escape. Overview returns to the opening; Explore the renderer jumps to the studio. IntersectionObserver tracks section transitions, while a passive, frame-batched listener updates document progress. The header hides down, reveals up and stays visible while the dropdown is open. Scroll offsets account for its measured height, and reduced-motion preferences disable smooth scrolling and header transitions.

Source references use a reusable Radix preview popover: hover/focus to inspect, click/tap to keep open, and Escape or the close button to dismiss. Examples are independently written explanations of verified mechanisms; they do not distribute the original source or clinical formulas.

## Evidence and publishing boundary

- **Original evidence:** safe production screenshots already supplied in v4 and user-provided Apple listing screenshots; source paths and descriptive technical summaries verified against the original repository; contributor-provided responsibilities.
- **Independent reconstruction:** all new portfolio code, diagrams and the fictional field-journal playground. Diagrams in `Diagram.tsx` recreate the original article, collection, navigation and checklist concepts as accessible HTML/CSS; they are readable responsive content, not embedded screenshots.
- **Original documentation:** `article_diagram_screenshot.png` is included unchanged with explicit user authorization on October 19, 2026, and labeled as an original artifact. It appears at full height alongside the recreated article content model, with an enlarged dialog and original-resolution link. Other internal Drupal/documentation images remain outside public output pending permission. A supplied article/media screenshot with a presenter's name is excluded rather than published unredacted.
- **Product scope:** later releases, all clinical content and individual tools are not claimed as solely the contributor's work. No performance, adoption or clinical-outcome metric is invented. Supplied screenshot dates/versions are unverified.
- **Public context:** [Apple App Store](https://apps.apple.com/us/app/impella-app/id991345042) and [Google Play](https://play.google.com/store/apps/details?id=com.abiomed.impella&hl=en_US), reviewed October 19, 2026. These listings describe the wider app; they do not prove authorship or release-free changes. No remote store images are required at runtime.
- **Future concept:** semantic retrieval/RAG is labeled unshipped, with versioned approved sources, citations and human review. No medical computation is delegated to an LLM.

## Static deployment

`npm run build` creates `dist/`. Upload **only the contents of `dist/`** to a static host. Relative Vite base paths support a subdirectory as well as a root deployment; serve `index.html` over HTTP. The app uses anchor navigation, so no SPA route rewrite is needed. It works without an external API or runtime network service. Source maps are disabled.

Do not deploy the workspace root, original React Native repository, original HTML, ZIP, unapproved internal docs, environment/configuration files or repository history. Do not add those paths to `public/`. To share the new source, share this `portfolio/` directory excluding `node_modules`, test artifacts and caches. Nothing was published by this task.

See `AUDIT.md`, `EVIDENCE.md`, `PUBLIC_RESEARCH.md` and `VERIFICATION.md` for findings, provenance, independently checked product history and verification results.
