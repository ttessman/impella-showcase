# Component and CMS architecture

These conventions reflect explicit user decisions. Preserve them during edits.

## One implementation, with CMS adapters

- A base React component owns markup, layout, styling, visual variants and behavior.
- A CMS adapter maps `id`, `metadata` and recursive `content` to that base component's
  ordinary React props/children. Name the adapter `<Name>Bundle` in `<Name>Bundle.tsx`.
- Direct React usage and CMS usage must use the same base implementation. Do not
  duplicate JSX or introduce a parallel view inside an adapter, including alternate
  variants such as the source-summary card.
- The base component must not require a CMS node, document context or renderer.
  An adapter may select a base capability, derive props and compose rendered children.
- Reuse existing primitives (Card, Dialog, Button, IconButton, popovers) internally.
  Interactive bundles own their portals/dialogs; do not expose implementation
  scaffolding as authored CMS bundles.

## Files and folders

- Checklist-owned configuration records (questions/options/rules/outcomes) are data,
  not separate UI components. Do not create empty React component stubs for them.
- Each renderable bundle has one owning folder under `src/components/CMS/bundles/<Name>/`.
  Base components may be colocated with their adapters; a shared existing primitive
  keeps its own home. There must still be only one base implementation.
- Bundle-specific views, fields, styles, hooks and models belong with that bundle.
- `src/components/CMS/renderers/` contains BundleRender, DocumentRenderer and
  ContentView together. ContentView renders ordered nodes; BundleRender dispatches
  their bundle names; DocumentRenderer provides the document model/context.
- Use `model/` for contracts, validation, traversal and derived data; use `utils/`
  for small supporting utilities. Avoid vague shared folders and thin wrappers
  scattered across unrelated component directories.
- Each React component gets its own file and named function declaration. Constants
  can stay in that file. The restriction is on multiple React components, not constants.

## Authored contract and verification

- Every authored node contains only `id`, `bundle`, `metadata`, and `content`.
  Only the document root declares `metadata.schema_version`; descendants inherit it.
- Variants are supported metadata props, implemented by the base React component.
  Normal content arrays retain their order; frame parents recognize header/footer.
- Preserve the studio's bounded draft compatibility and interactions unless an
  explicit migration is requested. Normalize before generic ContentView rendering.
- Keep the original production repository and unapproved assets outside this repo.
  See the workspace AGENTS.md and EVIDENCE.md for the publishing boundary.
- Verify meaningful changes with typecheck, lint, `npm run verify:cms`, build and
  appropriate existing browser scenarios. Do not push or deploy without authorization.
