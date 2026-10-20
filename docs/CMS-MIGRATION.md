# Recursive case-study CMS migration

Approved October 20, 2026. This is an independently authored portfolio renderer,
not the original production API contract.

## Contract and boundaries

Every authored node has exactly `id`, `bundle`, `metadata`, and `content`.
The page root declares `metadata.schema_version: 1`; descendants inherit it.
IDs are stable and unique within the document. Bundles select registered code.
Metadata is typed per bundle and contains supported props, including visual
variants. Content is ordered child nodes, leaf text, or null as appropriate.

Normal arrays render in order. Frame parents recognize direct `header` and
`footer` children; headings use `heading`. No authored `region` or `slots` keys.
Layout variants belong to metadata, not separate bundles or project-specific
renderers. Interactive capabilities (checklist, source reference, content studio)
own their shared dialogs, portals, toolbars and state internally. Their content
and supported configuration are authored; generic modal/portal scaffolding is
not exposed to the CMS.

## Execution

1. Introduce discriminated node contracts, a root validator, recursive tree/index
   helpers, and registered rendering through ContentView / BundleRender.
2. Add generic layout/content adapters around shared components: page, group,
   section, grid, card, header/footer, reading header, hero, figure, lists,
   actions, disclosures, code, source references and checklist.
3. Convert the complete current narrative/composition to a local JSON document.
   Preserve section IDs, copy, assets, citation handling and visual language.
   Derive section numbering/navigation from the document, never a parallel list.
4. Preserve Content Studio as the specialized application island. Adapt its
   existing bounded editor format at the shared renderer boundary, without
   broadening its input limits or disrupting editing/draft/drag behavior.
5. Derive readable output and page metadata from the same document. Remove
   obsolete project-specific composition and duplicate editorial definitions.
6. Validate a second synthetic page using the same renderer. Verify typecheck,
   lint, production prerender/build, browser behavior, responsive layouts,
   accessibility, source popovers, all checklist combinations and studio flows.

## Validation and safety

Reject unknown bundles/props/versions, duplicate IDs, invalid child shapes,
unsafe links/media, conflicting frame parts, and unresolved references. Use
separate document/editor limits. JSON cannot carry JavaScript, raw HTML, DOM
selectors, arbitrary CSS or component imports. Action names resolve to trusted
application behavior. Keep all original source and unapproved assets outside
this repository. Preserve evidence provenance and ownership boundaries.

## Completion record

Implementation and verification results will be recorded here as work proceeds.
No push or deployment is authorized by this migration.

### Completed implementation

- The complete Impella document is `src/content/pages/impella.json`: 480 nodes and
  all 11 existing sections. Schema version appears only at the root. Metadata
  owns allowlisted visual variants; there are no authored regions, slots, modals
  or portals.
- ContentView / BundleRender now use the typed recursive contract and registry.
  Generic adapters reuse shared Card, Dialog, Button, image, checklist and source
  primitives. Replaced project-specific compositions and duplicate content files
  were removed. Their presentation rules moved beside the CMS adapter families.
- Navigation/numbering, root SEO/ownership, readable HTML, the reader summary,
  full-text companion and agent index derive from the same document. Product
  subject metadata preserves the existing name and publisher independently of
  the uppercase reading-navigation brand.
- The studio preview normalizes its existing validated blocks at the renderer
  boundary. Its draft schema, limits, mutations and drag controller remain intact.
  Preview IDs are namespaced. Checklist outcomes use recursive ContentView.
- A second synthetic page renders with the same components, including outlined
  and tinted cards, reordered structural parts and derived section navigation.
  It requires no Impella-specific renderer or Content Studio instance.

### Verification — October 20, 2026

- TypeScript, ESLint (zero warnings), production build/prerender and diff checks
  passed. No dependency or approved evidence asset changed.
- `npm run verify:cms` passed: all node envelopes, 11 sections, local media paths,
  second-page rendering, frame placement, navigation reordering/renaming, 17
  invalid-document cases and all 16 checklist combinations.
- Full production-build Chrome suite: **80 passed, 7 expected skips**, across
  desktop, tablet and mobile, in 35 seconds. This includes studio editing/JSON,
  nested content/citations, dragging, responsive panes, reading-header visibility,
  navigation, source previews, checklist states, dialogs, PDF printing, hydration,
  no-JavaScript reading, images, console checks and accessibility.
- An intermittent empty-section drag test measured coordinates while scrolling
  was still settling. It now waits for element stability before measuring; no
  editor drag logic changed. Six repeated targeted runs and the full suite passed.
- Desktop tool-card/source-preview and mobile checklist screenshots were visually
  reviewed. Original images and ownership distinctions remain intact.

The studio's editing contract intentionally remains a compatibility format. This
migration expands the page renderer; it does not expose the entire case-study
vocabulary in the small educational editor. No push or deployment was performed.

### Bundle folders — October 20, 2026

Each registered bundle now has its own entry point under
`src/components/CMS/bundles/<BundleName>/<BundleName>.tsx`. Hero, Page, Card,
Grid, Section and the remaining bundles are no longer grouped in Layout.tsx
or Content.tsx. Their styles are colocated in the owning bundle folders.
The registry imports these named entry points; shared rendering helpers live
in CMS/shared. Checklist-owned data bundles retain their non-visual behavior.
This changes organization, not the authored contract or presentation.

Verification after the folder split: typecheck, lint, CMS checks and production
build passed. Full browser suite: **80 passed, 7 expected skips in 34.3 seconds**.

### Existing bundle consolidation and renderer grouping — October 20, 2026

Moved the original checklist, source-reference, reading-navigation, evidence and
studio-fallback implementations into their owning bundle folders. Bundle-specific
studio field editors now live with Heading, TextBlock, Media, Section and
ReferencesAccordion; the studio dispatcher selects them. Its compatibility types,
factory and palette use explicit StudioBundle naming in the studio model folder.
Normalization happens before ContentView, which now accepts only CMS nodes.

BundleRender.tsx, DocumentRenderer.tsx and ContentView.tsx are siblings in
CMS/renderers. FrameContent/RichContent belong to this renderer family; context
and document operations live in model, while asset formatting lives in utils.
The generic shared folder and obsolete block/component directories were removed.
Each React component has its own file; constants remain allowed. DialogClose and
TooltipProvider were separated, and a focused ESLint rule checks component count.

Typecheck, lint, CMS verification and production build pass. Component-boundary
checks confirm that ordinary constants remain allowed and multiple components
are rejected. The production browser suite passed **80 tests with 7 expected
skips in 34.7 seconds**. The subsequent renderer-path grouping produced identical
JavaScript and CSS asset hashes and passed the build/CMS checks. No authored
content, studio draft payload, evidence asset or dependency changed.

### One base implementation with CMS adapters — October 20, 2026

All 23 renderable bundle registry entries now point to named *Bundle adapters.
Base components accept ordinary React props/children, own UI/state/variants and
have no dependency on CMS nodes, context or renderers. Adapters map data and
compose rendered children. Existing shared primitives retain their single home.

The source-summary card is now a variant of the same Card used directly in React;
CardBundle no longer owns an alternate article tree. References compose the base
Disclosure/List, Grid delegates its element frame to Group, and Media consolidates
the duplicated evidence/gallery image-dialog implementation. Pure media/navigation
view definitions are mapped explicitly from CMS fields. Styling vocabulary moved
to presentation definitions independent of CMS nodes. Checklist-owned data records
no longer have empty component stubs; the owning checklist interprets them.

Recorded the pattern in the repository AGENTS.md and linked it from the workspace
agent guide. Added ESLint boundaries for thin adapters and CMS-independent bases,
while retaining the one-component-per-file convention and allowing constants.

Typecheck, lint, production prerender/build and CMS verification pass. Direct React
and CMS Card markup matches exactly for outlined, tinted and source-summary views.
The full production browser suite passed **80 tests, 7 expected skips in 38 seconds**.
Existing studio editing, citations, source tabs, dialogs, navigation, checklist
outcomes, SEO, accessibility and responsive behavior passed without changing the
page JSON, original assets, dependencies or studio draft format.
