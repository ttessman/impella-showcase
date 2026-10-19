# Evidence map

All source paths below are relative to the read-only `../impella-react-native/` directory. Source files are not copied into this application.

| Case study claim              | Evidence reviewed                                                                                  | Interpretation / limit                                                                                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typed resource contracts      | src/types/content.d.ts                                                                             | Records cover regions, language, articles, collections, checklists, landing screens and calculators. Broad original interfaces are not a strict discriminated union; the demo strengthens that boundary.                    |
| Content-to-component dispatch | src/components/CMS/ContentView/ContentView.tsx; BundleRender/BundleRender.tsx                      | ContentView maps IDs/bundles to a switch-based renderer. No claim that the original uses a registry object.                                                                                                                 |
| HTML fragment handling        | CMS/BlockRender/BlockRender.tsx                                                                    | react-native-render-html handles fragments with style control; full CMS page webviews were the alternative described by the contributor.                                                                                    |
| Article composition           | docs/docs/architecture/content/articles.md; content.d.ts                                           | Six primary bundles, separate related list, fixed shell conventions. Generic recursive article sections are demo-only.                                                                                                      |
| Article metadata caveat       | CMS/BundleRender/BundleRender.tsx                                                                  | article_info currently returns null even though documentation describes optional date/read-time display.                                                                                                                    |
| Collection layouts            | components/CollectionContent/CollectionContent.tsx; CMS/CollectionBlock/*; content/collections.md  | Code selects grouped mode for more than one collection_values item. Documentation describes taxonomy, grouping labels and initial 10 versus 3 card behavior.                                                                |
| Media                         | CMS/MediaBlock/MediaBlock.tsx                                                                      | Dedicated image/video paths; supplied Browse shot shows video resource thumbnails. The demo supports local images only.                                                                                                     |
| References                    | CMS/ReferencesBlock/ReferencesBlock.tsx; BlockRender/BlockRender.tsx; TextBlock/TextBlock.test.tsx | Native accordion with reference strings rendered through BlockRender. Demo uses escaped reference entries and browser details/summary. Inline text supports numeric `<sup>` markers only; numbering remains author-managed. |
| Navigation                    | hooks/useTabNavigatorScreens.tsx; architecture/menus.md; navigation.md                             | Configuration selects titles/icons/content routes; app-owned routes still exist. No evidence establishing how later production changes were deployed.                                                                       |
| Landing and favorites         | content/landingScreens.md; architecture/favorites.md                                               | Role/specialty targeting, weight and configured tiles; user favorites are separate from authored page content.                                                                                                              |
| Checklists                    | content/checklists.md; content.d.ts                                                                | Question groups, options, result operators and reference containers. Clinical rule validity is outside this reconstruction.                                                                                                 |
| Calculators                   | content/calculators.md; src/components/{AKI,PAPi,CPO,Heparin}Calculator; src/util/*_calculator.js  | Dedicated implementation with fixed expected component shapes/order; not arbitrary CMS compositions.                                                                                                                        |
| Personal ownership            | User-provided project history                                                                      | Repository supports architectural mechanisms, not independent proof of individual authorship.                                                                                                                               |

## Screenshot provenance

Five PNGs were decoded directly from the supplied v4 HTML (no external hotlinks). Original aspect ratio: 1260 × 2736. EXIF and textual PNG metadata were removed without changing pixels; the table retains original decoded-file hashes for provenance. No account/patient identifiers were apparent during visual review. A sixth screenshot containing a presenter's name is excluded. One original documentation diagram, `article_diagram_screenshot.png`, was subsequently explicitly authorized for deployable inclusion by the user. Other internal documentation/Drupal imagery remains excluded.

| File in public/assets/production | Source alt text       | SHA-256 prefix |
| -------------------------------- | --------------------- | -------------- |
| browse.png                       | Browse screen         | 517201efc5f3   |
| references.png                   | Article references    | 6315fd2f28a2   |
| related.png                      | Related content cards | 1960f21d1bda   |
| home.png                         | Home and favorites    | f9a5fb67fdd8   |
| calculator.png                   | AKI calculator        | 3dfa9f354b2d   |

Public app listings supplied by the user were reviewed October 19, 2026. Apple lists Impella App; Google Play currently labels the listing Clinical Care while retaining the Impella identifier/description. The portfolio keeps the historical Impella project name. Store links are provided for context; no store rating, metric or latest-version claim appears in the case study.

## User-provided Apple listing images

Five 460 × 996 WebP images appeared in the public asset folder during the task and were visually reviewed, then renamed from `460x996bb*.webp` to feature-specific names. These are the user-provided Apple listing screenshots discussed in the chat, linked to the Apple listing in the portfolio. No patient/account identifiers or personal names were apparent. EXIF/XMP metadata was removed without changing pixels; ICC color profiles were retained.

- `apple-home.webp`: six landing tiles and Favorites.
- `apple-article.webp`: article actions, video thumbnail and text; no presenter name. The visible publication date differs from the archived renderer's disabled article_info behavior, explicitly acknowledged in its caption.
- `apple-checklist.webp`: question accordion and checkbox options.
- `apple-aki.webp`: calculator choice controls.
- `apple-heparin.webp`: calculator slider inputs.

The gallery labels Apple listing imagery separately from supplied captures. Neither source establishes capture date, native-app version, author ownership of a particular clinical feature or clinical validation. Both original files and Apple screenshots are product evidence; only the fictional journal is an interactive reconstruction.

## Approved original article diagram

On October 19, 2026 the user explicitly answered “Yes, include the original diagram” to the question authorizing `docs/static/img/article_diagram_screenshot.png` in the deployable portfolio build. Only this documentation image is approved by that answer. The 1980 × 7240 image was copied unchanged into `public/assets/documentation/`; the original repository file was not modified. `ArticleEvidence.tsx` shows the full-height original image alongside a recreated content model explaining authoring, native presentation and related resources. The native enlarged dialog and original-resolution link remain available. Original evidence and the recreated model are labeled independently.

Approved diagram SHA-256 (same for the original and deployed copy): `ea3e017366fc3466290112b1ccc5959a1a947a4159e9106a07609d5650ec07f5`.

## Editorial refinement

The contributor’s final narrative brief supplies the modernization history:
an outdated, buggy app with external-resource links; a client seeking a cohesive
experience; CMS selection and content delivery still open when the native
rendering approach was proposed. The performance concern was anticipated,
not measured. Personal contributions include calculator and interactive-tool
development alongside the content architecture; this does not establish sole
product ownership or authorship of the clinical math.

Calculator descriptions were checked directly against `CalculatorScreen.tsx`,
all four calculator components, their `util/*_calculator.js` helpers, and
`architecture/content/calculators.md`. The screen dispatches by calculator type.
Dedicated components read fixed-position CMS fields, watch form inputs, call
math helpers, and display results. The documentation identifies the math helpers
as supplied by the website. These are distinct from the generic article bundle
renderer. No original implementation or formulas were copied into the portfolio.

## Regional navigation evidence

`redux/menus/menus.selectors.ts` selects the bottom menu by the user's region
and locale-derived language (including a DE-to-EU mapping and US fallback).
`useTabNavigatorScreens.tsx` maps those selected records to native destinations.
The US/Japan Favorites example in the case study is explicitly the authoring
documentation's example, not a claim about the screenshots' country of origin.
Section 06 reuses the existing reviewed `home.png` and `apple-home.webp` assets
to show visible navigation differences; neither has verified region/version
metadata. No additional internal documentation imagery was published.

## Broader product workflow review

Personal ownership is contributor-provided; the following mechanisms describe the broader team’s original application. They are not added to the portfolio studio.

- Authentication: `architecture/auth/index.md`, `app/Startup.tsx` and `redux/auth/auth.reducer.ts` document separate customer Auth0/employee Okta paths, profile state and credential checks on resume. The code has a logout path on credential failure; this is not a guarantee of universal offline access or current provider behavior.
- Favorites: `architecture/favorites.md`, `FavoritesButton.tsx`, `auth.selectors.ts` and preference saga actions connect saved content URLs/types to user state and remote preferences. The portfolio does not claim sole authorship or conflict-free offline synchronization.
- Discovery/personalization: `hooks/useSearch.tsx` indexes titles/tags with Fuse.js; content selectors consume region, role and specialty state. `useLandingPageTiles` selects supported landing content. This is existing local search, separate from future RAG.
- Offline article assets: `architecture/offline.md`, `hooks/useAssets.tsx` and `redux/assets/assets.saga.ts` confirm downloads of article media/attachments, cached paths and conditional resets while online. Downloads depend on authentication/connectivity; downloaded reading does not make every login, network or synchronization action offline-capable.
- Calculators: `screens/CalculatorScreen.tsx`, `CPOCalculator`, `AKICalculator` and the calculator documentation confirm dedicated native components, shared input controls and prearranged CMS fields. No formulas were copied or modified.

Public release evidence and research limits are recorded separately in [PUBLIC_RESEARCH.md](PUBLIC_RESEARCH.md). It documents later releases and listing availability, not implementation continuity.

Contributor clarification: the Okta employee sign-in frontend was implemented by the contributor; identity tenant provisioning/configuration was not. This personal responsibility is stated by the contributor, with the repository corroborating the sign-in mechanism. Customer Auth0 integration and the wider authentication system are not claimed as sole personal work.

Contributor clarification: favorites and their local application state were also the contributor’s work. Cached article media remains a verified broader product capability; individual ownership of its download/cache implementation is not assigned. Remote favorites preference synchronization is described as a mechanism, without extending the local-state ownership claim to identity infrastructure or unspecified backend work.

## Calculator and checklist explanation

Reviewed both `architecture/content/calculators.md` and `architecture/content/checklists.md` against `CalculatorScreen`, the four calculator components, `CalculatorSlider`, `RadioButtons`, `ResultsBlock` and `ChecklistContent`. The calculator documentation explicitly requires a fixed component order; code reads those positions, watches form values, integrates existing helpers and resets forms on navigation blur. Shared controls provide numeric entry/sliders/selections. Result visibility uses tool-specific checks; no universal or independently clinically validated input validation is claimed.

Checklist documentation describes authored groups, conditions, results, references and disclaimers. The code evaluates authored AND/OR conditions on submit, selects the first matching result or the final fallback, and scrolls result content into view. The portfolio’s high-level flow is independently recreated and contains no clinical rules. Calculator frontend work is credited to the contributor; checklist implementation is described as product behavior without adding unconfirmed individual ownership.

The tools section reuses the already reviewed Apple AKI and checklist screenshots as historical evidence. The AKI image demonstrates inputs, not an asserted result screen. Build-time metadata and plain-text companions repeat the same contribution/reconstruction boundaries; they publish no original source or internal documentation beyond the specifically approved article image.

The fictional “Pack a tiny adventure” checklist independently demonstrates grouped selections, submit-time AND/OR evaluation, first-match priority, a fallback and result focus/scrolling. Its creative prompts, schema and implementation are newly authored portfolio material. No clinical rules, calculations or private source are reproduced. Source popups describe individual file responsibilities; the calculator illustration represents the watched-input → provided-helper → conditional-result lifecycle verified in the original CPO/PAPi components, without their formulas or field limits.

The revised checklist is opened from the checklist evidence card. Its two grouping levels reflect the documented accordion → labeled questions/options pattern. All creative copy, group definitions, modal labels and combination rules live in a separately imported local JSON file. Live feedback is a portfolio presentation choice; the original submit-triggered behavior remains accurately described in the product account. Single, pair, triple and four-option examples are independent nonclinical content. Source previews now show a per-file independent illustration first, with contextual file descriptions on hover/focus or in a touch-accessible disclosure.
