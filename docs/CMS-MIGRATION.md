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
