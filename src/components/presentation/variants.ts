/** Supported visual vocabulary. JSON selects variants, never CSS classes or styles. */
export const variants = {
  group: {
    "tool-description": "tool-description",
    "tool-example": "tool-example",
    "hero-actions": "hero-actions",
    "hero-meta": "hero-meta",
    "diagram-stack": "diagram-stack",
    "diagram-annotation": "diagram-annotation",
    "diagram-box": "diagram-box",
    "diagram-box-fixed": "diagram-box fixed",
    "diagram-box-authored": "diagram-box authored",
    "group-heading": "group-heading",
    "original-article-notes": "original-article-notes",
    "product-workflow": "product-workflow",
    "store-links": "store-links",
    "future-concept": "future-concept",
    "public-evidence": "public-evidence",
    "public-evidence-sources": "public-evidence-sources",
    "footer-summary": "footer-summary",
  },
  grid: {
    "two-column": "two-column",
    decision: "decision-grid",
    "source-summary": "source-grid",
    anatomy: "anatomy-grid",
    collection: "collection-diagram",
    navigation: "navigation-evidence",
    tools: "tool-experiences",
    gallery: "product-gallery",
  },
  text_block: {
    note: "note",
    eyebrow: "eyebrow",
    small: "small",
    "section-intro": "section-intro",
    "diagram-label": "diagram-label",
    "diagram-index": "diagram-index",
    "resource-placeholder": "resource-placeholder",
    "hero-summary": "hero-summary",
    "hero-detail": "hero-detail",
    "rule-note": "checklist-rule-note",
    plain: "plain-text",
  },
  figure: {
    architecture: "architecture-figure",
    "compact-flow": "compact-flow-figure",
    "tool-flow": "tool-flow-figure",
    anatomy: "anatomy-figure",
    "original-article": "original-article-evidence",
  },
  list: {
    pipeline: "pipeline",
    navigation: "nav-diagram",
    "tool-flow": "tool-flow",
    summary: "summary-strip",
    impact: "impact-list",
    "public-evidence": "public-evidence-list",
  },
} as const;
export function variantClass(family: keyof typeof variants, variant?: string) {
  return variant
    ? ((variants[family] as Record<string, string>)[variant] ?? "")
    : "";
}

export type VariantName<Family extends keyof typeof variants> =
  keyof (typeof variants)[Family];
