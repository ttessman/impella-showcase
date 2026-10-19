/** Independently recreated architecture diagrams; original evidence is labeled separately. */
export const flowDiagrams = {
  pipeline: {
    figureClass: "architecture-figure",
    listClass: "pipeline",
    label: "",
    steps: [
      ["Drupal", "Authors compose supported fields"],
      ["JSON contract", "Records, bundles & relationships"],
      ["Native dispatch", "ContentView → BundleRender"],
      ["Mobile experience", "Reusable React Native UI"],
    ],
    caption:
      "Independent architecture reconstruction · Based on the original content contracts and CMS renderer modules.",
  },
  navigation: {
    figureClass: "compact-flow-figure",
    listClass: "nav-diagram",
    label: "REGIONAL MENU CONFIGURATION",
    steps: [
      ["Menu records", "Labels, icons, order and destinations"],
      ["Region + language", "Select the configured menu"],
      ["Native screens", "Resolve supported routes into tabs"],
    ],
    caption:
      "Configuration changes the menu; new route types and native behavior still require application code.",
  },
  calculator: {
    figureClass: "tool-flow-figure",
    listClass: "tool-flow",
    label: "CALCULATOR / NATIVE IMPLEMENTATION",
    steps: [
      ["Configured copy", "CMS labels, descriptions and units"],
      ["Native inputs", "Shared sliders, numeric entry and selections"],
      ["Existing helpers", "Tool-specific calculation integration"],
      ["Results", "Shared presentation, with conditional visibility"],
    ],
    caption:
      "Calculator fields had a fixed expected order. Changing a tool’s structure or behavior required application code.",
  },
  checklist: {
    figureClass: "tool-flow-figure",
    listClass: "tool-flow",
    label: "CHECKLIST / AUTHORED INTERACTION",
    steps: [
      ["Question groups", "Optional headings, labels and selectable options"],
      ["Selection rules", "Authored AND/OR conditions, evaluated on submit"],
      ["Result content", "Matching headers and text, scrolled into view"],
      ["Supporting context", "References and disclaimer copy"],
    ],
    caption:
      "Recreated from the checklist documentation and renderer. Question and result content shared the CMS composition system.",
  },
} as const;
export const articleDiagram = {
  label: "ARTICLE / CONTENT MODEL",
  regions: [
    {
      tone: "fixed",
      label: "Fixed presentation",
      titles: ["Actions & article title"],
      detail: "Favorites · optional attachment",
    },
    {
      tone: "authored",
      label: "Primary content / authored order",
      titles: ["Header → Text → Media", "CTA → Table → References"],
      detail: "Flat primary_content_value array",
    },
    {
      tone: "",
      label: "Separate authored region",
      titles: ["Related content cards"],
      detail: "related_content_list",
    },
  ],
  annotations: [
    {
      title: "Authors choose the reading order.",
      body: "Drupal stores the primary blocks as an ordered list. Authors arrange text, media and actions without creating a separate screen.",
    },
    {
      title: "The app provides the shared frame.",
      body: "Native components keep article actions and layout consistent. Text fragments use a native HTML renderer; media and actions use dedicated components.",
    },
    {
      title: "Relationships connect the experience.",
      body: "Reference containers hold supporting sources, while a separate related-content list becomes resource cards below the article. Other content types, such as checklists, have their own nested question structures.",
    },
  ],
  caption:
    "Recreated from architecture/content/articles.md and content.d.ts. The original article layout artifact alongside this model shows how these regions appear on a composed page.",
} as const;
export const collectionDiagram = {
  label: "COLLECTION / TWO PRESENTATIONS",
  heading: "Title + optional heading components",
  continuous: {
    title: "Continuous scrolling",
    cards: ["Article card", "Calculator card", "Checklist card"],
    footer: "Initial 10 items → reveal more on scroll",
  },
  grouped: {
    title: "Grouped collections",
    groups: ["Authored grouping label", "Another authored group"],
    action: "View More →",
    cards: "Resource card × up to 3 initially",
  },
  caption:
    "Recreated from architecture/content/collections.md. Authors could organize the same resource types into a continuous list or grouped reading paths.",
} as const;
