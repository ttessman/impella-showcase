import type { SectionDefinition, TextContent } from "../types/caseStudy";

/** Editorial definitions keep product history and ownership separate from layout. */
export const sectionDefinitions = {
  overview: {
    id: "overview",
    number: "01",
    label: "Context & ownership",
    title: "A more useful app needed a stronger foundation.",
    intro:
      "Impella was an existing clinical mobile application for healthcare professionals. The modernization was an opportunity to bring information and tools into a more cohesive experience.",
  },
  architecture: {
    id: "architecture",
    number: "02",
    label: "The architectural decision",
    title: "Separate content authoring from the mobile experience.",
    intro:
      "I wanted the modernization to address the maintenance problems behind the old app. When full-page webviews were proposed, I questioned whether a second presentation layer would recreate those difficulties.",
  },
  contract: {
    id: "contract",
    number: "03",
    label: "Content architecture",
    title: "A small contract. A reusable rendering system.",
    intro:
      "I defined the boundary between authoring and presentation: Drupal supplied structured JSON, typed contracts described its shape, and the app selected a native component for each content type.",
  },
  articles: {
    id: "articles",
    number: "04",
    label: "Article composition",
    title: "Authors compose. Components render.",
    intro:
      "I created sample pages and documentation to show authors how to build an article from supported blocks: headings, text, media, calls to action, tables and references. They could work on the content without implementing a mobile screen.",
  },
  collections: {
    id: "collections",
    number: "05",
    label: "Dynamic collections",
    title: "Shared resources. Different reading paths.",
    intro:
      "Bringing resources into the app also meant giving people useful ways to find them. Shared resource records let authors organize articles, checklists and calculators into different collection layouts.",
  },
  navigation: {
    id: "navigation",
    number: "06",
    label: "Dynamic navigation",
    title: "Navigation could adapt to the region.",
    intro:
      "I supported navigation that could reflect regional needs. The app selected menu records by the user’s region and language, then resolved their labels, icons and destinations into supported native routes.",
  },
  tools: {
    id: "tools",
    number: "07",
    label: "Interactive content",
    title: "More than a place to read.",
    intro:
      "I also developed interactive tools that brought user input and calculated results into the experience. Articles provided information; checklists and calculators supported workflows beyond reading.",
  },
  product: {
    id: "product",
    number: "08",
    label: "Production application",
    title: "Information and tools, brought together.",
    intro:
      "The shipped product brought browsing, articles, embedded media, references, favorites and calculators into one mobile experience. Follow the experience from home and browsing into an article, its supporting resources, and finally checklists and calculators. Select any image for a closer look.",
  },
  ownership: {
    id: "ownership",
    number: "09",
    label: "Impact & ownership",
    title: "A foundation the team could keep building on.",
    intro:
      "My contribution connected content authoring, native presentation and interactive functionality. The source verifies the reusable mechanisms; the screenshots show their place in the broader product.",
  },
  playground: {
    id: "playground",
    number: "10",
    label: "Try the architecture",
    title: "One content model. Many native experiences.",
    intro:
      "Try composing a page from supported content types. The JSON describes the content; the renderer turns it into components. This independent web reconstruction illustrates my original approach using fictional content. Generic nested sections extend the original article model for demonstration.",
    tone: "demo-section",
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
      "I focused on how content and interactive functionality would reach the user. I proposed the native rendering approach, defined the JSON contracts, implemented reusable React Native components, and created sample pages and authoring documentation. I also developed calculators and interactive tools, collaborating with the team on content organization and navigation.",
    team: "The product was a team effort spanning the mobile app, CMS services and clinical content. This account describes my contributions; the source and documentation establish how the systems worked.",
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
      "Authors could configure different destinations for different regions. The original documentation gives an example: Favorites could be a tab in the US, while Japan could keep it accessible from Home. The menu selector uses the user’s region and language; the app then maps the selected records to native screens.",
    landingScreens:
      "Home had its own configuration: collection tiles, featured content and role or specialty targeting. Together, these systems supported different entry points into shared resources. New route types and native behavior still required application code.",
    evidenceNote:
      "These captures show different navigation layouts. Their regions and versions are unverified, so they illustrate the product’s range rather than a confirmed US/Japan comparison. Regional menu selection is verified in the source; the images do not establish how later changes were deployed.",
  },
  tools: {
    checklistTitle: "Authored rules, native behavior",
    checklists:
      "Checklists extended structured authoring to grouped questions, selectable options and conditional results. Authors supplied the rules and supporting references; native components handled the interaction. The diagram shows how those pieces fit together without reproducing the clinical rules.",
    calculatorTitle: "Purpose-built calculators",
    calculators: [
      " AKI, PAPi, CPO and heparin tools used dedicated React Native components. CMS records supplied labels, units and results copy in a fixed structure; the components managed inputs and called existing deterministic math helpers under ",
      {
        code: "src/util/",
      },
      " . Unlike articles, these layouts required code changes when their expected structure changed. ",
    ],
    clinicalBoundary:
      "These tools supported healthcare professionals alongside clinical judgment and local protocols. My contribution was interactive implementation, not authorship or independent validation of the underlying clinical formulas.",
  },
  product: {
    evidenceNote:
      "Historical captures and Apple listing images show the broader team’s product. Their dates and app versions are unverified, so later visual differences are not attributed to my implementation.",
  },
  ownership: {
    impact:
      "For authors, this established a supported vocabulary for maintaining pages. For developers, it centralized presentation instead of hardcoding each article. For users, it brought resources and tools into a shared interface. These are architectural capabilities; I do not have measured maintenance, usage or performance outcomes.",
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
