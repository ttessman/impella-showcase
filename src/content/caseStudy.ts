import type { SectionDefinition, TextContent } from "../types/caseStudy";

/** Editorial definitions keep product history and ownership separate from layout. */
export const sectionDefinitions = {
  overview: {
    id: "overview",
    number: "01",
    label: "Context & ownership",
    title: "A more useful app needed a stronger foundation.",
    intro:
      "Abiomed’s Impella application gave healthcare professionals resources for working with its heart pumps. Modernizing the existing app was an opportunity to bring clinical information, training and interactive tools into a more cohesive mobile experience.",
  },
  architecture: {
    id: "architecture",
    number: "02",
    label: "The architectural decision",
    title: "Separate content authoring from the mobile experience.",
    intro:
      "I wanted the modernization to address the maintenance problems behind the old app. When full-page webviews were proposed, I questioned whether a second presentation layer would recreate those difficulties.",
  },
  playground: {
    id: "playground",
    number: "03",
    label: "Content studio",
    title: "One content model. Many native experiences.",
    intro:
      "I designed a content model so authors could assemble pages from reusable components. The app interpreted that content as native React Native interfaces. Explore the approach below in an independent web reconstruction with fictional content; generic nested sections are a demo extension.",
    tone: "demo-section",
  },
  contract: {
    id: "contract",
    number: "04",
    label: "Content architecture",
    title: "A small contract. A reusable rendering system.",
    intro:
      "I defined the boundary between authoring and presentation: Drupal supplied structured JSON, typed contracts described its shape, and the app selected a native component for each content type.",
  },
  articles: {
    id: "articles",
    number: "05",
    label: "Article composition",
    title: "Authors compose. Components render.",
    intro:
      "I created sample pages and documentation to show authors how to build an article from supported blocks: headings, text, media, calls to action, tables and references. They could work on the content without implementing a mobile screen.",
  },
  collections: {
    id: "collections",
    number: "06",
    label: "Dynamic collections",
    title: "Shared resources. Different reading paths.",
    intro:
      "Bringing resources into the app also meant giving people useful ways to find them. Shared resource records let authors organize articles, checklists and calculators into different collection layouts.",
  },
  navigation: {
    id: "navigation",
    number: "07",
    label: "Dynamic navigation",
    title: "Navigation could adapt to the region.",
    intro:
      "I supported navigation that could reflect regional needs. The app selected menu records by the user’s region and language, then resolved their labels, icons and destinations into supported native routes.",
  },
  tools: {
    id: "tools",
    number: "08",
    label: "Interactive content",
    title: "Clinical tools within the same mobile experience.",
    intro:
      "I built native calculator interfaces alongside the app’s clinical reference content. Reusable controls and CMS-managed copy gave the team a shared foundation; tool-specific behavior and integration with provided calculation helpers stayed in native code.",
  },
  product: {
    id: "product",
    number: "09",
    label: "Production application",
    title: "Information and tools, brought together.",
    intro:
      "The shipped product brought browsing, articles, embedded media, references, favorites and calculators into one mobile experience. Follow the experience from home and browsing into an article, its supporting resources, and finally checklists and calculators. Select any image for a closer look.",
  },
  ownership: {
    id: "ownership",
    number: "10",
    label: "Impact & ownership",
    title: "Building for the people using and maintaining the product.",
    intro:
      "The product brought resources and tools together. My content architecture supported that experience by giving authors and developers a shared way to build and maintain it.",
  },
  reflection: {
    id: "reflection",
    number: "11",
    label: "Reflection & future evolution",
    title: "Modernization starts with why the old system struggled.",
  },
} satisfies Record<string, SectionDefinition>;

export const caseStudyCopy = {
  overview: {
    background:
      "The previous app was outdated, buggy and difficult to maintain, with much of its value delivered through links to external clinical resources. The client wanted a modern experience where professionals could browse information and use tools together. A CMS could help keep information current; the choice of CMS and its delivery model were still open.",
    contribution:
      "As a frontend engineer at Bounteous, I proposed native rendering for CMS-managed content, defined the JSON contracts and built the reusable React Native renderer. I also built calculator interfaces, favorites and their local app state, and the Okta employee sign-in frontend. Sample Drupal pages and documentation helped authors work with the system.",
    team: "I collaborated on content organization and navigation. The wider team delivered the application, CMS services and production content; I was not its sole developer or designer.",
  },
  architecture: {
    initialLabel: "INITIAL PROPOSAL",
    initialTitle: "Web pages inside the app",
    initialBody:
      "Webviews offered a practical way to reuse CMS pages. My concern was the longer-term cost of coordinating web and native layouts, interactions and performance. That was an anticipated risk, rather than a measured problem with the proposal.",
    proposedLabel: "PROPOSED & IMPLEMENTED",
    proposedTitle: "Content interpreted by the app",
    proposedBody:
      "I proposed structured content rendered by reusable native components. Drupal became the authoring system; React Native controlled presentation and behavior. This required more upfront engineering: a schema, supported components, and coordination whenever that vocabulary changed.",
    tradeoff:
      "The benefit was a shared foundation: authors could compose supported pages without a separate screen implementation for every article. This was a maintainability and experience decision; no performance benchmark was recorded.",
  },
  contract: {
    sourceNote:
      "Paths refer to the original private repository. These are descriptive summaries; original implementation files are not distributed with this portfolio.",
  },
  articles: {},
  collections: {
    composition: [
      " A collection combines a title, optional introductory blocks and resource groups. One group becomes a continuous scrolling list; multiple groups become labeled previews with View More. ",
      {
        code: "CollectionContent",
      },
      " selects the mode and passes it to the shared ",
      {
        code: "CollectionBlock",
      },
      " renderer. ",
    ],
    organization:
      "Tags and grouping labels gave authors a way to organize related material. The same cards and resource references supported both layouts, so a new reading path did not need a new resource model.",
  },
  navigation: {
    regionalMenus:
      "The documentation gives a concrete example: Favorites could be a tab in the US, while Japan could keep it accessible from Home. Authors could configure those regional differences.",
    landingScreens:
      "Home had its own configuration for collection tiles, featured content and role or specialty targeting—different entry points into the same shared resources.",
    evidenceNote:
      "These captures show different navigation layouts. Their regions and versions are unverified, so they illustrate the product’s range rather than a confirmed US/Japan comparison. Regional menu selection is verified in the source; the images do not establish how later changes were deployed.",
  },
  tools: {
    calculatorTitle: "Purpose-built calculators",
    calculators:
      "AKI, CPO, PAPi and heparin tools combined native inputs with existing calculation helpers. My frontend implementation connected shared controls, changing values and result presentation.",
    checklistTitle: "Author-configured checklists",
    checklists:
      "Authors configured questions and conditional results. The app evaluated selections on submit and brought matching result content into view, with supporting references.",
    clinicalBoundary:
      "Clinical formulas were provided; clinical validation was outside my role.",
  },
  product: {
    workflowTitle: "A complete mobile workflow",
    workflowBody:
      "I implemented favorites and their local app state, along with the Okta employee sign-in frontend. Identity tenant setup was handled separately. The team’s application also supported customer sign-in, profile-based content and local search across resource titles and tags.",
    offlineBody:
      "Downloaded article media and attachments could be read from local storage. Cache updates depended on connectivity and content changes; this supported reading after download, rather than making every account or synchronization action available offline.",
    evidenceNote:
      "Historical captures and Apple listing images show the broader team’s product. Their capture dates and app versions are unverified. Current listings still describe articles, media, calculators and checklists; recognizable patterns do not establish that the original implementation is unchanged.",
  },
  ownership: {
    impact:
      "This flexibility required upfront work on the schema, renderer and component library, followed by ongoing coordination as the content model changed. The capabilities shipped; reduced maintenance effort was an architectural aim, not a measured result.",
  },
  playground: {},
  reflection: {
    lessonTitle: "Design for the next change",
    lesson:
      "The lesson I take from this project is to look beyond replacing outdated technology. I needed to understand how content, presentation and maintenance had become entangled, then create a boundary that people could keep working with.",
    stewardship:
      "I would make that boundary explicit again, while investing early in runtime validation and author feedback. A reusable renderer still needs stewardship: schemas, supported components and documentation must evolve together. Flexibility only helps when authors and developers understand its limits.",
    futureLabel: "FUTURE CONCEPT / NOT SHIPPED",
    futureTitle: "Source-grounded discovery",
    futureRetrieval:
      "Today, I would explore semantic search or retrieval-augmented generation as another use of structured content. Retrieval would need approved, versioned sources, preserved source IDs and grounded citations.",
    futureBoundary:
      "Any clinical use would require appropriate human review and explicit handling of missing or conflicting evidence. This is a future exploration, separate from the shipped content system and deterministic calculators.",
  },
} satisfies Record<string, Record<string, TextContent>>;

export const caseStudySections = Object.values(sectionDefinitions);
