export const storeLinks = {
  apple: "https://apps.apple.com/us/app/impella-app/id991345042",
  google:
    "https://play.google.com/store/apps/details?id=com.abiomed.impella&hl=en_US",
};
export const sourceModules = [
  {
    title: "Contract",
    path: "src/types/content.d.ts",
    body: "Typed records define the fields authors can supply and the relationships between resources. Each article block carries a bundle name identifying its content type.",
  },
  {
    title: "Composition",
    path: "src/components/CMS/ContentView/ContentView.tsx",
    body: "Reads blocks in the author’s chosen order and passes each block’s ID, type and fields to the renderer.",
  },
  {
    title: "Dispatch",
    path: "src/components/CMS/BundleRender/BundleRender.tsx",
    body: "Matches the bundle name to a supported component, such as a heading, media block or references accordion.",
  },
  {
    title: "Presentation",
    path: "src/components/CMS/BlockRender/BlockRender.tsx",
    body: "Renders authored HTML text fragments with native typography rules. Dedicated components handle media and interactions.",
  },
];
export const screenshots = [
  {
    file: "apple-home.webp",
    title: "Home & favorites",
    body: "Configured collection tiles support discovery; personal favorites provide a way back to saved resources.",
    alt: "Impella landing screen with six collection tiles and a Favorites section",
  },
  {
    file: "browse.png",
    title: "Browse & embedded media",
    body: "Shared resource cards bring articles, videos and tools into the same browsing experience.",
    alt: "Impella Browse screen with calculator, article and video resource cards",
  },
  {
    file: "apple-article.webp",
    title: "Native article composition",
    body: "Article actions, video and text share one reading interface. This listing image includes a date; article metadata is disabled in the archived renderer.",
    alt: "Apple listing screenshot of an article with favorites and PDF actions, a video thumbnail and article text",
  },
  {
    file: "references.png",
    title: "Articles & references",
    body: "References sit alongside the article they support, within the shared reading layout.",
    alt: "Impella article with text and an expanded numbered references list",
  },
  {
    file: "related.png",
    title: "Related resources",
    body: "Related-resource cards give readers a path from an article to supporting skills videos.",
    alt: "Related Content section with two skills video cards beneath article references",
  },
  {
    file: "apple-checklist.webp",
    title: "Structured checklists",
    body: "Grouped questions and selectable options turn structured content into an interactive checklist.",
    alt: "Apple listing screenshot of the patient selection checklist with a question accordion and checkbox options",
  },
  {
    file: "apple-aki.webp",
    title: "AKI calculator",
    body: "Input controls and calculated results extend the experience beyond browsing and reading.",
    alt: "Impella AKI calculator screen showing yes or no input controls",
  },
  {
    file: "apple-heparin.webp",
    title: "Heparin calculator",
    body: "Sliders provide inputs to a purpose-built calculator. This product screenshot illustrates the UI; the portfolio does not perform clinical calculations.",
    alt: "Apple listing screenshot showing heparin calculator sliders and displayed input values",
  },
];
export const impactAudiences = [
  [
    "Healthcare professionals",
    "The broader team brought clinical resources, training media, documentation, favorites and interactive tools into one mobile experience.",
  ],
  [
    "Content authors",
    "My content model and renderer let authors arrange supported article blocks, media and references without a separately coded screen for each article. Related resources and purpose-specific nested structures connected that content; sample pages and documentation made the patterns tangible.",
  ],
  [
    "Development team",
    "Shared native components centralized presentation and interaction behavior. Developers could extend a supported vocabulary rather than recreate each article layout, while new component types and native behaviors still required engineering work.",
  ],
];

export const navigationExamples = [
  {
    file: "home.png",
    width: 1260,
    height: 2736,
    title: "Home with persistent tabs",
    source: "Supplied capture · Region unverified",
    alt: "Impella home with Favorites and Browse regions above Favorites, Browse, Tools and IFUs bottom tabs",
    body: "Favorites, Browse, Tools and IFUs are visible destinations in the bottom navigation. Home also presents saved resources and a Browse preview.",
  },
  {
    file: "apple-home.webp",
    width: 460,
    height: 996,
    title: "Home with collection tiles",
    source: "Apple listing · Region unverified",
    alt: "Impella home with six collection tiles above Favorites and no bottom tab bar visible in the capture",
    body: "Six collection tiles provide entry points from Home, with Favorites below. No persistent bottom tab bar is visible in this capture.",
  },
];
