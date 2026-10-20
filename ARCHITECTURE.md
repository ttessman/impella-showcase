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
   TypeScript-checked registry of named `*Bundle` adapters.
5. `CMS/bundles/<Name>/<Name>Bundle.tsx` maps authored nodes to the base React
   component in that folder or to an existing shared primitive. Normal nested
   content returns to ContentView. Bundle styles are colocated in their folders;
   common frame/text rendering helpers live beside ContentView in `CMS/renderers/`.

Array order is the default. Page/card/section/hero frames recognize direct header
and footer bundles and place them predictably. Heading is a distinct text bundle.
Card variants such as outlined, tinted and source-summary share a bundle. Group,
grid, figure, list, text and media variants are explicitly allowlisted in
`components/presentation/variants.ts`; there is no authored region or slot configuration.

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
`features/ContentStudio/model/toCmsBundle.ts` converts its validated blocks to the shared node
contract before preview rendering. Derived preview IDs are namespaced. This is an
explicit compatibility boundary, not a second renderer or a silent draft migration.

`features/ContentStudio/model/studioDocument.ts`, `parseContentPage`, editor fields/factories and tree operations
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

## Folder and component boundaries

`CMS/bundles/` owns bundle implementations, their field editors, views and local
hooks/models. Checklist, source reference, reading navigation and media views have
been consolidated here; the studio application remains its specialized feature.
Generic Dialog, Button, Card and other primitives remain outside the CMS.

`CMS/renderers/` contains BundleRender.tsx, DocumentRenderer.tsx and ContentView.tsx
as siblings. FrameContent and RichContent are rendering helpers in that same folder.
`CMS/model/` owns the document contract operations, validation, presentation
vocabulary, derived reading data and context. `CMS/utils/` owns small utilities
such as asset URL formatting. There is no generic shared dumping folder.

Each React component is a named export function in its own file. Constants may
remain alongside a component. DialogClose and TooltipProvider have their own files;
they are React components even though they wrap library primitives. ESLint checks
the one-component-per-file convention without prohibiting ordinary constants.

The studio's compatibility types explicitly use StudioBundle / StudioDocument
names. Normalization now happens in MobilePreview before ContentView; the generic
CMS renderer accepts only normalized CMS nodes.

## Base React components and CMS adapters

UI has one implementation. `<Name>.tsx` receives ordinary React props/children and
owns markup, visual variants and behavior. `<Name>Bundle.tsx` accepts the CMS node,
resolves metadata/context, maps data to base props and composes recursive content.
Adapters contain no native UI markup or interaction state. Bases do not depend on
CMS node types, document context or renderers. ESLint checks these boundaries.

Most bases are colocated with their adapters in the owning bundle folder. Existing
shared primitives keep their canonical home: CardBundle calls components/card/Card
for outlined, tinted and source-summary variants alike. There is no alternate CMS
Card implementation. Grid delegates its common element frame to Group; references
compose Disclosure and List. Media uses one image/enlargement path for evidence and
gallery variants. SourceReference, ReadingHeader and Checklist use their pure bases.
The Content Studio adapter composes its existing specialized feature boundary.

Shared styling vocabulary lives in components/presentation/variants.ts, independent
of CMS nodes; the validator reuses it. Media and reading navigation adapters resolve
CMS field names/IDs/asset paths into plain view definitions.

There are 23 renderable bundle adapters. Checklist-owned group/question/option/rule/
outcome records remain in the recursive contract as configuration data; their empty
component stubs were removed. The checklist adapter interprets those records and
renders active outcome children through ContentView.

The tracked AGENTS.md records these conventions for future agents. The workspace
AGENTS.md points to it. Ordinary constants remain allowed with a single React
component per file. The verification script compares direct React and CMS Card
markup for all three variants without a CMS provider around the direct example.
