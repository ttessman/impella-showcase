# Portfolio architecture

The portfolio uses the same recursive renderer for a complete case-study document
and the Content Studio preview. Content describes intent; registered adapters and
shared React primitives own presentation and interaction.

## Document contract

Every node contains exactly `id`, `bundle`, `metadata`, and `content`.
`types/cms.ts` defines a discriminated union with metadata/content types per bundle.
Only a page root declares `metadata.schema_version: 1`. Descendants inherit it.
IDs are stable document identities; bundles select registered components. Metadata
contains supported props and visual variants, never arbitrary CSS or JavaScript.
Content is ordered children, escaped leaf text, or null for checklist rules.

`content/pages/impella.json` is the authored page. `content/pageDocument.ts` validates
it once and builds its index. `CaseStudyPage` selects that document; `App` supplies
the shared tooltip provider. Neither composes project-specific section markup.

## Rendering pipeline

1. `CMS/model/validateDocument.ts` checks envelope, root version, bundle metadata,
   content shapes, IDs, placement, URLs, media paths and referenced targets.
2. `CMS/model/document.ts` walks the tree and derives sections, numbering, titles
   and anchor lookup. Nested sections own their headings independently.
3. `DocumentRenderer` provides this index to the subtree.
4. `ContentView` renders ordered children; `BundleRender` dispatches through a
   TypeScript-checked registry.
5. `CMS/bundles/<BundleName>/<BundleName>.tsx` gives each bundle its own component
   and folder, adapting authored nodes into shared React components. Normal nested
   content returns to ContentView. Bundle styles are colocated in their folders;
   common frame/text rendering helpers live in `CMS/shared/`.

Array order is the default. Page/card/section/hero frames recognize direct header
and footer bundles and place them predictably. Heading is a distinct text bundle.
Card variants such as outlined, tinted and source-summary share a bundle. Group,
grid, figure, list, text and media variants are explicitly allowlisted in
`CMS/model/variants.ts`; there is no authored region or slot configuration.

Document limits are 512 KiB serialized JSON, 1,000 nodes, depth 20 and 20,000
characters per string. Unknown properties, versions and bundles fail with a path.
Bundled media must use safe local asset paths. The approved original documentation
image remains explicitly marked; no new internal image is authorized by this model.

## Interaction boundary

Source references, checklist and content studio expose capabilities to authors.
They internally reuse PreviewPopover, Dialog, Button/IconButton, ImageDialog and
other shared primitives. Generic modal and portal scaffolding is not exposed as
CMS bundles. Radix retains mounting, focus, dismissal and scroll-lock behavior.

Source-reference children are code nodes with path/context metadata. The existing
code-first tabs, bounded longest-file canvas, tooltips and leading caret are shared.
Checklist groups/questions/options/rules/outcomes repeat the same node envelope.
These are owned data structures interpreted by the checklist adapter, rather than
independent page controls. An adapter builds the existing controller definition;
active outcome content returns to ContentView for rendering. Rules remain ordered,
first-match AND/OR conditions. All copy is authored, and updates remain live.

The specialized Content Studio application owns its editor, JSON drafts, drag/drop,
resizable panes and responsive Compose dialog. Its surrounding section and readable
server fallback are ordinary document content.

## Studio compatibility

The studio deliberately retains its bounded educational editing format:
`title` / `primary_content_value`, original field vocabulary and `demo_section`.
`CMS/model/studioAdapter.ts` converts its validated blocks to the shared node
contract before preview rendering. Derived preview IDs are namespaced. This is an
explicit compatibility boundary, not a second renderer or a silent draft migration.

`types/content.ts`, `parseContentPage`, editor fields/factories and tree operations
continue to enforce the studio's 100 KB / 100 blocks / five section-level limits.
The page schema is not exposed wholesale in the editor. Existing citations remain
safe numeric superscripts and manually aligned ordered references.

## Navigation and readable output

ReadingNavigation receives identity and actions from page data. Its section catalog
is derived from section nodes in document order, using authored labels and actual
headings. IDs remain stable when copy changes. ReadingHeader and the existing hooks
retain measured offsets, direction thresholds, progress and reduced-motion support.

The reader summary, full plain-text companion, metadata, structured ownership and
agent index derive from the same document. Prerender produces initial readable HTML;
React hydrates it, and the studio mounts afterward. Canonical URLs still require an
explicit deployment address. No public address has been invented.

## Extending and verifying

To author another case study, supply a validated page document using existing
bundles/variants. To add a capability, extend the node union, metadata validator and
registry, then add a generic adapter. Do not create a project-named bundle for a
layout that can be composed from existing groups, cards, figures and lists.

`tests/fixtures/second-case-study.json` renders without Impella-specific components,
copy, assets or studio. `npm run verify:cms` verifies that rendering, navigation
reordering/renaming, frame placement, asset existence, rejection cases and checklist
combinations. `npm run build` checks TypeScript and prerenders; `npm run lint` checks
code. `npm test` runs production-build Chrome interaction/accessibility scenarios
across desktop, tablet and mobile.

See [the migration plan](docs/CMS-MIGRATION.md) for scope and completion evidence.
