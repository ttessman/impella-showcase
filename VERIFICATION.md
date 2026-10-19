# Verification — October 19, 2026

Tested on Node 22.22.2 with installed Google Chrome against Vite's production preview server.

| Check                      | Result                                                                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency installation    | Passed; npm audit reported zero vulnerabilities at install time                                                                                                      |
| TypeScript                 | `npm run typecheck` passed                                                                                                                                           |
| ESLint                     | `npm run lint` passed                                                                                                                                                |
| Production build           | `npm run build` passed                                                                                                                                               |
| Playwright                 | **46 passed, 2 skipped in 19.5 seconds**                                                                                                                             |
| Viewports                  | Desktop 1440 × 1000; tablet 820 × 1180; mobile 390 × 844 with touch emulation                                                                                        |
| Images                     | All rendered images decoded, including the approved original diagram; no failed asset responses                                                                      |
| Console                    | No browser console errors or uncaught page errors in checked flows                                                                                                   |
| Responsive layout          | No horizontal document overflow at tested sizes                                                                                                                      |
| Accessibility              | No axe WCAG 2 A/AA or WCAG 2.1 AA violations in the default page at all three sizes                                                                                  |
| Keyboard                   | Skip link, content editing, drag pickup/drop/cancel, screenshot and diagram dialogs, focus restoration                                                               |
| Asset boundary             | Portfolio runtime, reviewed product screenshots, fictional artwork and one explicitly approved documentation image; no original source/config/history or source maps |
| Original diagram integrity | Deployed asset SHA-256 equals read-only original: ea3e017366fc3466290112b1ccc5959a1a947a4159e9106a07609d5650ec07f5                                                   |
| Original production source | Remains unmodified                                                                                                                                                   |

The two skipped cases are the touch-specific test in desktop/tablet projects. Real browser touch events passed in the mobile project.

## Checked behavior

- Full builder sequence at all three sizes: default example; add/edit heading; nested section and paragraph; reorder; remove; confirm JSON/preview synchronization; validate/apply edited JSON; syntax and structure errors; preserve last valid page; reset and verify exact restoration.
- Additional image asset/alt/caption edits, references, nested sections, removal of an active parent, selection and destination cleanup.
- Inline properties: selecting or adding a block reveals its own highlighted property editor directly beneath its row; verified on desktop/tablet/mobile. Pointer tests check upper/lower-half insertion, a single unlabeled insertion line, unchanged list height at drag start, synchronized JSON order, and drops inside empty sections. Desktop and mobile authoring captures visually reviewed.
- Mouse and keyboard dragging at all three sizes; mobile touch dragging. Complete subtree movement preserves IDs and descendants. Cross-container nesting, unnesting, cancellation, focus restoration and draft locking work. Tree operations reject cycles/invalid destinations. The same runtime validator protects depth and schema constraints on applied moves.
- Validation rejects unknown bundles/keys, wrong types, missing children, unsupported heading levels, unsafe media URLs, invalid reference items, duplicate IDs, and size/depth/count violations.
- Original article diagram loads at 1980 × 7240, scrolls with keyboard input, opens a native modal, focuses its close button, closes with Escape and returns focus. Original-resolution link is available.
- Local navy/blue/gold palette and responsive screenshots reviewed; production imagery stays separately attributed.
- Adjustable workspace: Compose collapse/restore, side-by-side and vertically stacked output, pointer/keyboard divider sizing, min/max limits, individual and overall layout reset, auto stacking at narrow widths, and preservation of visual edits and pending JSON drafts. Minimum-height checks keep JSON actions and the phone within their panels. Collapsed and stacked views pass axe checks at all three viewport sizes; desktop captures visually reviewed.

## Evidence and limits

The user explicitly approved including `article_diagram_screenshot.png` in the deployable portfolio on October 19, 2026. It is included unchanged and labeled as original documentation. All other internal documentation imagery remains outside public output. A supplied screenshot with a named presenter remains excluded.

This is an independent web reconstruction, not clinical validation of the native application. Demo media uses local images; no clinical calculation or rule is reproduced. Demo edits reset on reload. Source summaries explain mechanisms without distributing original proprietary implementation. Public app-store links provide context, not proof of individual ownership or how later releases were deployed.

Automated checks do not replace assistive-technology testing or a complete browser/device matrix. Safari, Firefox, physical devices, clinical rules and external app-store uptime were not end-to-end tested. No site was published.

## Content studio refinement

The final studio has a compact title/disclaimer header with icon-and-text reset actions. Compose collapses from its upper-right icon into a full-height 48px labeled rail, with keyboard focus restored to the corresponding control. Output has one state-aware, tooltip-equipped layout icon shared by Inspect and Preview. Default and reset layouts put Preview above JSON, with a 48% / 52% split. Narrow workspaces enforce that same order and disable unavailable side-by-side mode.

The studio is capped at 100dvh (100vh fallback); workspace scrolling happens below its header. Scroll-aware dragging, sticky headers, reset placement, icon names, tooltip state, rail height, mounted editor preservation and draft state were tested. The mobile preview renders a fixed 390 × 844 canvas with uniform scale, fitting its pane and using a smaller cap in stacked mode. Tests confirm its aspect ratio and containment through long content, internal scrolling, collapse and layout changes. Desktop and mobile captures were reviewed.

Final complete suite: 46 passed, 2 skipped. The skipped cases remain the touch-only scenario on desktop and tablet projects; mobile touch passed. Both deployable and source archives were refreshed and checked for integrity and allowed asset boundaries.
