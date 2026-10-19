# Audit and resolution

Reviewed the v4 HTML, all 19 embedded image occurrences, CMS modules/types, collection/navigation implementations and architecture documentation. Original HTML and production repository remain unmodified.

| Initial finding                                                                    | Resolution                                                                                                                   |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 11.5 MB HTML embeds images; no external broken URL found                           | Named local production assets; independently recreated architecture diagrams                                                 |
| A screenshot names a presenter                                                     | Excluded from public assets; Browse thumbnails still evidence media                                                          |
| Four accumulating style blocks, content and imperative JS in one file              | Separate React/TypeScript components, data, renderer, tree operations and CSS                                                |
| Index-based mutable editor, no selection, no image support                         | Stable IDs, immutable updates, selection, image properties, recursive sections                                               |
| JSON accepts missing fields, wrong types and misplaced page nodes                  | Strict runtime validation with paths, unknown-key/type, duplicate ID, depth and size checks                                  |
| Visual edits overwrite unfinished JSON                                             | Explicit draft state, validate/apply/discard; visual mutations disabled until resolved                                       |
| Video UI only a label                                                              | Working local image media; no simulated video playback claim                                                                 |
| Weak contextual labels and focus handling                                          | Named native controls, focus styles, status announcements, skip link and keyboard editing                                    |
| No empty major section found; future retrieval discussion incomplete               | All requested topics populated, future concept explicitly grounded in citations, versioned approved sources and human review |
| Arbitrary recursive sections do not match the original article contract            | Explicitly label section as reconstruction-only; original primary_content_value is flat                                      |
| Original BundleRender uses switch dispatch                                         | Describe dispatch accurately; reconstruction uses a registry                                                                 |
| Original BlockRender handles HTML fragments                                        | Explain react-native-render-html separately from full-page webviews; demo uses plain text                                    |
| Collection docs mention labels/tags; code groups when collection_values.length > 1 | Explain code behavior and distinguish documentation guidance                                                                 |
| Calculators separate from generic CMS                                              | Dedicated components, deterministic util helpers, fixed ordering; no AI calculation claims                                   |
| Screenshots described as current without version evidence                          | Undated supplied product evidence; no release-free-update inference                                                          |
| No automated verification pipeline in v4                                           | Typecheck, lint, production build and end-to-end browser checks                                                              |

Internal documentation images stay outside public output pending permission. Original source, credentials, configuration and history are excluded from deployable output. Attribution is based on contributor-provided responsibilities; repository corroborates mechanisms, not individual authorship. Final check results: VERIFICATION.md.

Final implementation removed the unused original `at()` traversal helper and all accumulated legacy styles/scripts. Browser checks pass; see VERIFICATION.md. Public PNGs have EXIF/text metadata removed without changing pixels.

Five user-supplied Apple listing screenshots were also reviewed and incorporated during implementation. They are locally named, metadata-stripped and individually attributed.

Follow-up: added mouse/touch/keyboard drag-and-drop for blocks and complete section subtrees, including cross-container movement, cycle protection, schema/depth validation and focus restoration. Updated the portfolio palette to Impella navy, blue and gold; fictional illustration colors remain independent.

Approved follow-up: the user explicitly authorized the original article layout diagram for deployable inclusion. Added it unchanged with attribution, region explanations, keyboard scrolling and an enlarged view. Other internal documentation imagery remains excluded.

Authoring usability follow-up: moved properties directly beneath the selected block, increased field/header legibility and brought selected/new properties into view. Replaced expanding labeled drop slots with row-half hit testing and a single insertion line that does not shift layout. Empty sections retain a clear nesting target. Keyboard destinations remain announced without adding visible repeated labels.

Workspace follow-up: added collapsible Compose, side-by-side/stacked Inspect + Preview, adjustable split dividers with pointer/touch/keyboard controls, size limits and layout reset. Layout state is independent of content and JSON drafts. Responsive container rules stack narrow workspaces and hide unusable dividers. Panel sizing keeps JSON actions and the phone inside their respective areas.

Content studio refinement: replaced the large toolbar with pane-header icon controls and tooltips; retained Compose as a full-height labeled rail when collapsed; grouped both reset actions in the compact header; made preview-first stacked mode the default. The studio is capped at the viewport height with internal workspace scrolling. The disclaimer is in the header. Preview uses a fixed 390 × 844 uniformly scaled device canvas, with a smaller stacked rendering and a 48/52 default split favoring JSON. Verified focus timing, scroll-aware dragging and preservation of mounted editor state when reordering panes.

## Architecture refactor and contextual reading navigation

- Large page/editor components mixed content, commands, layout and rendering. The app now separates editorial definitions, shared contracts, feature hooks/models, named layout slots and individual CMS renderers. Component folders and colocated styles describe their responsibilities; `ARCHITECTURE.md` documents extension points.
- Repeated overlay logic is replaced by shared Radix Dialog, Popover and Tooltip components; Button supports Radix Slot composition. Source references and image evidence use those shared surfaces. Original production code remains outside the portfolio.
- Styles previously depended on workspace ancestry. Compose fields now scope to the composer itself, including when portalled into the mobile dialog. Browser assertions check the modal field layout. JSON editor foundation styles remain owned by the inspector.
- The old website menu did not show reading location. Its replacement derives numbered destinations from the actual section definitions, tracks the current section, provides a primary renderer link and shows document progress. The header retains direction-aware visibility and stays visible while Sections is open.
- Dropdown dismissal initially restored focus with scrolling, which displaced the selected anchor. Focus now restores without scrolling; tests verify the resulting section location and heading clearance.
- Tests are grouped by editor, dragging, workspace, evidence, reading navigation and source references, with shared studio helpers. No case-study section content or intended builder behavior changed during this refactor.

Current verification results are recorded in `VERIFICATION.md`. Changes are committed locally only; no push or publication.

## Final narrative and public evidence audit

- Ownership is spread across the hero, overview and six late deliverables; make the frontend role and Bounteous context explicit early, then use outcomes to explain value rather than repeat responsibilities.
- Studio is section 10, after the production gallery; relocate it to section 03 after the decision/pipeline, preserving its implementation and IDs. Renumber the remaining sections and keep navigation derived from the same ordered definitions.
- Product scope underrepresents account state, saved resources, search and offline article media. Add a brief repository-verified explanation of these broader team capabilities, with appropriate cache/session limits.
- Impact collapses three audiences into one paragraph. Replace the repeated deliverables with concise audience outcomes and a compact linked public-evidence area. Avoid measured savings or clinical outcomes.
- Research leads contain a release-note mismatch: the redesign note belongs to iOS 3.3.1, not 3.3.2. Record the primary-source findings and limits in PUBLIC_RESEARCH.md.

Narrative resolutions: the studio now follows the architecture decision as section 03; all eleven numbered navigation targets remain generated from the ordered definitions. Early role copy names the Bounteous frontend role, renderer, calculator interfaces, sample authoring work, Okta sign-in frontend and favorites/local state. Identity tenant setup and offline caching ownership remain separate. The outcomes area now distinguishes three audiences and links compact public product evidence. Original source, clinical formulas, documentation image and production screenshots are unchanged. A custom SVG favicon replaces the old tab icon reference.
