export const storeLinks = {
  apple: "https://apps.apple.com/us/app/impella-app/id991345042",
  google:
    "https://play.google.com/store/apps/details?id=com.abiomed.impella&hl=en_US",
};
export const sourceModules = [
  {
    title: "Contract",
    path: "src/types/content.d.ts",
    body: "Article, Collection, Checklist and Calculator records describe authored fields and content relationships. ArticleContentValue carries the bundle discriminator.",
  },
  {
    title: "Composition",
    path: "src/components/CMS/ContentView/ContentView.tsx",
    body: "Iterates authored content and passes id, bundle and properties into BundleRender. IDs are used as React keys.",
  },
  {
    title: "Dispatch",
    path: "src/components/CMS/BundleRender/BundleRender.tsx",
    body: "A bundle switch selects HeaderBlock, TextBlock, MediaBlock, ReferencesBlock and other specialized components.",
  },
  {
    title: "Presentation",
    path: "src/components/CMS/BlockRender/BlockRender.tsx",
    body: "Uses react-native-render-html for authored text fragments with controlled typography. This is distinct from a full CMS webpage in a webview.",
  },
];
export const screenshots = [
  {
    file: "browse.png",
    title: "Browse & embedded media",
    body: "A shared card pattern introduces articles, video resources and dedicated tools.",
    alt: "Impella Browse screen with calculator, article and video resource cards",
  },
  {
    file: "references.png",
    title: "Articles & references",
    body: "Article text and an expanded references region share a consistent reading layout.",
    alt: "Impella article with text and an expanded numbered references list",
  },
  {
    file: "related.png",
    title: "Related resources",
    body: "Authored relationships lead readers to associated skills videos through resource cards.",
    alt: "Related Content section with two skills video cards beneath article references",
  },
  {
    file: "apple-home.webp",
    title: "Favorites & discovery",
    body: "Authored collection tiles provide entry points to content; favorites remain a user-generated region.",
    alt: "Impella landing screen with six collection tiles and a Favorites section",
  },
  {
    file: "apple-aki.webp",
    title: "Dedicated clinical tools",
    body: "Calculators belong to the wider product, with dedicated UI and deterministic math helpers.",
    alt: "Impella AKI calculator screen showing yes or no input controls",
  },
  {
    file: "apple-article.webp",
    title: "Native article composition",
    body: "Article actions, embedded media and authored text sit within the reading interface. This store image shows a date; the archived renderer disables article metadata.",
    alt: "Apple listing screenshot of an article with favorites and PDF actions, a video thumbnail and article text",
  },
  {
    file: "apple-checklist.webp",
    title: "Structured checklists",
    body: "Question accordions and selection controls show how structured interactions extend beyond rich article layout.",
    alt: "Apple listing screenshot of the patient selection checklist with a question accordion and checkbox options",
  },
  {
    file: "apple-heparin.webp",
    title: "Purpose-built calculator UI",
    body: "A separate calculator screen presents slider inputs. This is product evidence, not a functioning clinical tool in this portfolio.",
    alt: "Apple listing screenshot showing heparin calculator sliders and displayed input values",
  },
];
export const deliverables = [
  [
    "Architecture proposal",
    "Challenged full-page webviews and proposed structured content rendered through native components.",
  ],
  [
    "Content contracts",
    "Defined JSON schemas and typed contracts for content bundles and relationships.",
  ],
  [
    "Rendering system",
    "Implemented the React Native rendering architecture and reusable composition patterns.",
  ],
  [
    "Authoring workflow",
    "Supported Drupal-based composition and demonstrated it through sample pages and authoring documentation.",
  ],
];
