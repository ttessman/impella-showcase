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

- `src/data/caseStudy.ts`: source summaries, screenshot metadata, links and ownership data.
- `src/components/`: editorial sections, independently recreated diagrams and accessible product screenshot dialog.
- `src/builder/model.ts`: discriminated union, example data, defaults and runtime parser.
- `src/builder/tree.ts`: immutable traversal, updates, removal, sibling reordering and cycle-safe subtree moves.
- `src/builder/useBlockDrag.ts`: mouse, touch, pen and keyboard dragging across page and section containers.
- `src/builder/BlockFields.tsx`, `BlockList.tsx`: selected block properties and recursive authoring tree.
- `src/builder/ContentRenderer.tsx`: bundle dispatch and recursive section rendering.
- `src/builder/Playground.tsx`: state coordination, draft lifecycle, validation and preview.
- `src/builder/PanelWorkspace.tsx`: pane headers, full-height collapsed Compose rail and shared output controls.
- `src/builder/workspaceLayout.ts`: initial preview-first stacked layout and panel proportions.
- `src/builder/MobilePreview.tsx`: fixed 390 × 844 device canvas, uniformly scaled to fit the pane with internal content scrolling.
- `src/components/ResizableSplit.tsx`: reusable pointer/touch/keyboard separator with limits and reset.
- `src/styles.css`: shared styles, responsive layouts, reduced-motion and focus rules.
- `public/assets/production/`: five production screenshots extracted from the supplied HTML plus five user-provided Apple listing images, named by feature.
- `public/assets/documentation/`: the original article layout diagram, explicitly approved by the user for inclusion in the deployable build.
- `public/assets/demo/`: independently authored, fictional SVG illustrations and favicon.
- `tests/portfolio.spec.ts`: complete builder sequence, nested/media edits, strict validation, keyboard, image, console, accessibility and responsive checks.

React/TypeScript is warranted here because recursive editing, synchronized JSON drafts and runtime validation have meaningful state complexity. Vite produces a static deployment; no backend, authentication, external font service or CMS access is needed.

## Demo contract and behavior

The demo uses actual bundle/field vocabulary (`header`, `text_block`, `media`, `references_accordion`, `primary_content_value`) where useful, but **is not the original API schema or original proprietary source**. `demo_section` adds arbitrary recursive composition for teaching. Original article primary blocks are flat; original nested content includes purpose-specific structures such as references containers and checklist question arrays. The demo's image sub-bundle, heading level, bundled image paths and stricter union are independently designed. It intentionally renders plain text rather than original HTML fragments. Strings are escaped by React; there is no direct HTML injection.

Add any supported bundle at page root or in a section using the destination selector. Select a block to open its highlighted property editor directly beneath that block; selecting or adding brings its fields into view. Arrows reorder siblings; remove also removes nested children. Drag a grip to reorder blocks or move whole sections between containers. Hover the upper or lower half of a block to insert before or after it. A single blue line indicates the insertion point, without adding labels or shifting the list during dragging. Empty sections provide one clear drop area. Focus a grip and press Space to pick up, use arrow keys/Home/End to choose a position, and press Enter to drop or Escape to cancel. Touch dragging uses pointer capture; arrows remain available. Cyclic moves are blocked, and excessive nesting is rejected without changing the page. Stable IDs preserve selection through reorders. Generated JSON always reflects the last applied page. Editing JSON starts an explicit draft and disables visual mutations. Validate checks it without applying; Apply updates editor and preview atomically; Discard restores the last applied JSON. Reset discards the draft and restores the original working example. There is no persistent storage: refresh also resets the demonstration.

**Content studio** stays within `100dvh` (`100vh` fallback). Its compact header keeps the disclaimer beneath the title and places icon-and-text **Reset layout** / **Reset example** actions together. The workspace scrolls inside the frame; pane headers stay available while scrolling.

Use the tooltip-equipped icon in Compose’s upper-right corner to collapse it into a full-height rail with an expand icon and vertical title. The shared Output header has one state-aware icon that switches between side-by-side and stacked views. **Stacked is the default, with the mobile preview above JSON**, using 48% for preview and 52% for the inspector. Drag dividers to adjust those proportions. A focused divider responds to arrow keys (Shift increases the step), Home/End set limits, and Enter or double-click restores its initial split. Horizontal widths and stacked proportions are remembered separately during the session. **Reset layout** restores the initial view without discarding edits or JSON drafts. Narrow workspaces always keep Preview above JSON; the layout icon indicates that state and is disabled with an explanatory tooltip until side-by-side has enough room. Unavailable dividers are hidden.

The mobile mockup renders a fixed 390 × 844 canvas and scales it uniformly to fit its available space. Its maximum rendered width is slightly smaller in stacked mode (300px versus 320px side by side). Changing content or panel dimensions cannot stretch the device: content scrolls inside the fixed frame. Layout transitions keep the editors mounted and preserve their state.

Validation rejects unknown bundles and properties, duplicate/invalid IDs, wrong types, missing required fields, unsafe/unbundled media sources and excessive size/depth/count. Errors name the failing field path. Bounds: 100 KB JSON, 100 blocks, 5 section levels, 5,000 characters per string, 30 reference entries. Drafts and invalid changes never replace the last valid page. All image choices are local and nonclinical. References are fictional text, not source links. No calculator or clinical rules are reproduced.

## Evidence and publishing boundary

- **Original evidence:** safe production screenshots already supplied in v4 and user-provided Apple listing screenshots; source paths and descriptive technical summaries verified against the original repository; contributor-provided responsibilities.
- **Independent reconstruction:** all new portfolio code, diagrams and the fictional field-journal playground. Diagrams in `Diagram.tsx` recreate the original article, collection, navigation and checklist concepts as accessible HTML/CSS; they are readable responsive content, not embedded screenshots.
- **Original documentation:** `article_diagram_screenshot.png` is included unchanged with explicit user authorization on October 19, 2026, and labeled as an original artifact. It has a keyboard-scrollable frame, enlarged dialog and original-resolution link. Other internal Drupal/documentation images remain outside public output pending permission. A supplied article/media screenshot with a presenter's name is excluded rather than published unredacted.
- **Product scope:** later releases, all clinical content and individual tools are not claimed as solely the contributor's work. No performance, adoption or clinical-outcome metric is invented. Supplied screenshot dates/versions are unverified.
- **Public context:** [Apple App Store](https://apps.apple.com/us/app/impella-app/id991345042) and [Google Play](https://play.google.com/store/apps/details?id=com.abiomed.impella&hl=en_US), reviewed October 19, 2026. These listings describe the wider app; they do not prove authorship or release-free changes. No remote store images are required at runtime.
- **Future concept:** semantic retrieval/RAG is labeled unshipped, with versioned approved sources, citations and human review. No medical computation is delegated to an LLM.

## Static deployment

`npm run build` creates `dist/`. Upload **only the contents of `dist/`** to a static host. Relative Vite base paths support a subdirectory as well as a root deployment; serve `index.html` over HTTP. The app uses anchor navigation, so no SPA route rewrite is needed. It works without an external API or runtime network service. Source maps are disabled.

Do not deploy the workspace root, original React Native repository, original HTML, ZIP, unapproved internal docs, environment/configuration files or repository history. Do not add those paths to `public/`. To share the new source, share this `portfolio/` directory excluding `node_modules`, test artifacts and caches. The workspace contains `../impella-portfolio-static.zip` (production files only) and `../impella-portfolio-source.zip` (new application source and local assets). Nothing was published by this task.

See `AUDIT.md`, `EVIDENCE.md` and `VERIFICATION.md` for findings, provenance and check results.
