import { SourceReference } from "./components/SourceReference";
import { sourceExamples } from "./data/sourceExamples";
import { NavigationEvidence } from "./components/NavigationEvidence";
import { SiteHeader } from "./components/SiteHeader";
import { ArticleEvidence } from "./components/ArticleEvidence";
import Playground from "./builder/Playground";
import { Section } from "./components/Section";
import { Diagram } from "./components/Diagram";
import { ProductGallery } from "./components/ProductGallery";
import { deliverables, sourceModules, storeLinks } from "./data/caseStudy";
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to case study
      </a>
      <SiteHeader />
      <main id="main">
        <div className="hero-band">
          <div id="top" className="hero">
            <div className="hero-copy">
              <p className="eyebrow">
                CASE STUDY / MOBILE CONTENT ARCHITECTURE
              </p>
              <h1>
                Content, composed
                <br />
                <em>natively.</em>
              </h1>
              <p className="hero-summary">
                Modernizing a clinical app around the people using it—and the
                people keeping its content current.
              </p>
              <p className="hero-detail">
                I helped shape the technical direction of Impella’s
                modernization: proposing native CMS rendering, building the
                content system, and developing interactive tools alongside the
                wider product team.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#architecture">
                  Explore the architecture <span aria-hidden="true">↓</span>
                </a>
                <a className="text-link" href="#playground">
                  Open content studio ↓
                </a>
              </div>
              <div className="hero-meta">
                <span>React Native</span>
                <span>Headless Drupal</span>
                <span>Typed JSON</span>
              </div>
            </div>
            <figure className="hero-evidence">
              <div className="hero-grid-lines" aria-hidden="true" />
              <div className="hero-evidence-label">
                <span>THE DELIVERED EXPERIENCE</span>
                <span>01 / 08</span>
              </div>
              <img
                src={`${import.meta.env.BASE_URL}assets/production/apple-home.webp`}
                alt="Apple listing screenshot: Impella home with six authored collection tiles"
                width="460"
                height="996"
                fetchPriority="high"
              />
              <figcaption>
                Authored entry points. A native experience.
                <br />
                <span>Apple listing evidence · Capture date unverified</span>
              </figcaption>
            </figure>
          </div>
          <div className="summary-strip">
            <div>
              <span>THE PROBLEM</span>
              <p>
                An aging app.
                <br />
                Fragmented resources and tools.
              </p>
            </div>
            <div>
              <span>THE DECISION</span>
              <p>
                Author structured data.
                <br />
                Render with native components.
              </p>
            </div>
            <div>
              <span>MY CONTRIBUTION</span>
              <p>
                Native content architecture,
                <br />
                interactive tools & authoring guidance.
              </p>
            </div>
          </div>
        </div>
        <Section
          id="overview"
          number="01"
          label="Context & ownership"
          title="A more useful app needed a stronger foundation."
          intro="Impella was an existing clinical mobile application for healthcare professionals. The modernization was an opportunity to bring information and tools into a more cohesive experience."
        >
          <div className="two-column">
            <p>
              The previous app was outdated, buggy and difficult to maintain,
              with much of its value delivered through links to external
              clinical resources. The client wanted a modern experience where
              professionals could browse information and use tools together. A
              CMS could help keep information current; the choice of CMS and its
              delivery model were still open.
            </p>
            <div>
              <p>
                I focused on how content and interactive functionality would
                reach the user. I proposed the native rendering approach,
                defined the JSON contracts, implemented reusable React Native
                components, and created sample pages and authoring
                documentation. I also developed calculators and interactive
                tools, collaborating with the team on content organization and
                navigation.
              </p>
              <p className="note">
                The product was a team effort spanning the mobile app, CMS
                services and clinical content. This account describes my
                contributions; the source and documentation establish how the
                systems worked.
              </p>
            </div>
          </div>
        </Section>
        <Section
          id="architecture"
          number="02"
          label="The architectural decision"
          title="Separate content authoring from the mobile experience."
          intro="I wanted the modernization to address the maintenance problems behind the old app. When full-page webviews were proposed, I questioned whether a second presentation layer would recreate those difficulties."
        >
          <div className="decision-grid">
            <article>
              <p className="eyebrow">INITIAL PROPOSAL</p>
              <h3>Web pages inside the app</h3>
              <p>
                Webviews offered a practical way to reuse CMS pages. My concern
                was the longer-term cost of coordinating web and native layouts,
                interactions and performance. That was an anticipated risk,
                rather than a measured problem with the proposal.
              </p>
            </article>
            <article>
              <p className="eyebrow">PROPOSED & IMPLEMENTED</p>
              <h3>Content interpreted by the app</h3>
              <p>
                I proposed structured content rendered by reusable native
                components. Drupal became the authoring system; React Native
                controlled presentation and behavior. This required more upfront
                engineering: a schema, supported components, and coordination
                whenever that vocabulary changed.
              </p>
            </article>
          </div>
          <Diagram kind="pipeline" />
          <p className="note">
            The benefit was a shared foundation: authors could compose supported
            pages without a separate screen implementation for every article.
            This was a maintainability and experience decision; no performance
            benchmark was recorded.
          </p>
        </Section>
        <Section
          id="contract"
          number="03"
          label="Content architecture"
          title="A small contract. A reusable rendering system."
          intro="I defined the boundary between authoring and presentation: Drupal supplied structured JSON, typed contracts described its shape, and the app selected a native component for each content type."
        >
          <div className="source-grid">
            {sourceModules.map((m, i) => (
              <article key={m.title}>
                <span className="diagram-index">0{i + 1}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
                <code>{m.path}</code>
              </article>
            ))}
          </div>
          <p className="note">
            Paths refer to the original private repository. These are
            descriptive summaries; original implementation files are not
            distributed with this portfolio.
          </p>
        </Section>
        <Section
          id="articles"
          number="04"
          label="Article composition"
          title="Authors compose. Components render."
          intro="I created sample pages and documentation to show authors how to build an article from supported blocks: headings, text, media, calls to action, tables and references. They could work on the content without implementing a mobile screen."
        >
          <ArticleEvidence />
        </Section>
        <Section
          id="collections"
          number="05"
          label="Dynamic collections"
          title="Shared resources. Different reading paths."
          intro="Bringing resources into the app also meant giving people useful ways to find them. Shared resource records let authors organize articles, checklists and calculators into different collection layouts."
        >
          <Diagram kind="collections" />
          <div className="two-column">
            <p>
              A collection combines a title, optional introductory blocks and
              resource groups. One group becomes a continuous scrolling list;
              multiple groups become labeled previews with View More.
              <code> CollectionContent</code> selects the mode and passes it to
              the shared <code>CollectionBlock</code> renderer.
            </p>
            <p>
              Tags and grouping labels gave authors a way to organize related
              material. The same cards and resource references supported both
              layouts, so a new reading path did not need a new resource model.
            </p>
          </div>
          <SourceReference source={sourceExamples.collections} />
        </Section>
        <Section
          id="navigation"
          number="06"
          label="Dynamic navigation"
          title="Navigation could adapt to the region."
          intro="I supported navigation that could reflect regional needs. The app selected menu records by the user’s region and language, then resolved their labels, icons and destinations into supported native routes."
        >
          <Diagram kind="navigation" />
          <div className="two-column">
            <p>
              Authors could configure different destinations for different
              regions. The original documentation gives an example: Favorites
              could be a tab in the US, while Japan could keep it accessible
              from Home. The menu selector uses the user’s region and language;
              the app then maps the selected records to native screens.
            </p>
            <p>
              Home had its own configuration: collection tiles, featured content
              and role or specialty targeting. Together, these systems supported
              different entry points into shared resources. New route types and
              native behavior still required application code.
            </p>
          </div>
          <NavigationEvidence />
          <p className="note">
            These captures show different navigation layouts. Their regions and
            versions are unverified, so they illustrate the product’s range
            rather than a confirmed US/Japan comparison. Regional menu selection
            is verified in the source; the images do not establish how later
            changes were deployed.
          </p>
          <SourceReference source={sourceExamples.navigation} />
        </Section>
        <Section
          id="tools"
          number="07"
          label="Interactive content"
          title="More than a place to read."
          intro="I also developed interactive tools that brought user input and calculated results into the experience. Articles provided information; checklists and calculators supported workflows beyond reading."
        >
          <div className="tools-grid">
            <Diagram kind="checklist" />
            <div>
              <h3>Authored rules, native behavior</h3>
              <p>
                Checklists extended structured authoring to grouped questions,
                selectable options and conditional results. Authors supplied the
                rules and supporting references; native components handled the
                interaction. The diagram shows how those pieces fit together
                without reproducing the clinical rules.
              </p>
              <h3>Purpose-built calculators</h3>
              <p>
                AKI, PAPi, CPO and heparin tools used dedicated React Native
                components. CMS records supplied labels, units and results copy
                in a fixed structure; the components managed inputs and called
                existing deterministic math helpers under <code>src/util/</code>
                . Unlike articles, these layouts required code changes when
                their expected structure changed.
              </p>
              <p className="note">
                These tools supported healthcare professionals alongside
                clinical judgment and local protocols. My contribution was
                interactive implementation, not authorship or independent
                validation of the underlying clinical formulas.
              </p>
            </div>
          </div>
          <SourceReference source={sourceExamples.calculators} />
        </Section>
        <Section
          id="product"
          number="08"
          label="Production application"
          title="Information and tools, brought together."
          intro="The shipped product brought browsing, articles, embedded media, references, favorites and calculators into one mobile experience. Follow the experience from home and browsing into an article, its supporting resources, and finally checklists and calculators. Select any image for a closer look."
        >
          <ProductGallery />
          <p className="note">
            Historical captures and Apple listing images show the broader team’s
            product. Their dates and app versions are unverified, so later
            visual differences are not attributed to my implementation.
          </p>
          <p className="store-links">
            Public product listings:{" "}
            <a href={storeLinks.apple}>Apple App Store ↗</a>
            <a href={storeLinks.google}>Google Play ↗</a>
            <span>
              Reviewed October 19, 2026. Listings describe the broader product,
              not individual ownership.
            </span>
          </p>
        </Section>
        <Section
          id="ownership"
          number="09"
          label="Impact & ownership"
          title="A foundation the team could keep building on."
          intro="My contribution connected content authoring, native presentation and interactive functionality. The source verifies the reusable mechanisms; the screenshots show their place in the broader product."
        >
          <div className="deliverable-list">
            {deliverables.map(([title, body], i) => (
              <div key={title}>
                <span className="diagram-index">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="note">
            For authors, this established a supported vocabulary for maintaining
            pages. For developers, it centralized presentation instead of
            hardcoding each article. For users, it brought resources and tools
            into a shared interface. These are architectural capabilities; I do
            not have measured maintenance, usage or performance outcomes.
          </p>
        </Section>
        <Section
          id="playground"
          number="10"
          label="Try the architecture"
          title="One content model. Many native experiences."
          intro="Try composing a page from supported content types. The JSON describes the content; the renderer turns it into components. This independent web reconstruction illustrates my original approach using fictional content. Generic nested sections extend the original article model for demonstration."
          tone="demo-section"
        >
          <Playground />
        </Section>
        <Section
          id="reflection"
          number="11"
          label="Reflection & future evolution"
          title="Modernization starts with why the old system struggled."
        >
          <div className="two-column">
            <div>
              <h3>Design for the next change</h3>
              <p>
                The lesson I take from this project is to look beyond replacing
                outdated technology. I needed to understand how content,
                presentation and maintenance had become entangled, then create a
                boundary that people could keep working with.
              </p>
              <p>
                I would make that boundary explicit again, while investing early
                in runtime validation and author feedback. A reusable renderer
                still needs stewardship: schemas, supported components and
                documentation must evolve together. Flexibility only helps when
                authors and developers understand its limits.
              </p>
            </div>
            <div className="future-concept">
              <p className="eyebrow">FUTURE CONCEPT / NOT SHIPPED</p>
              <h3>Source-grounded discovery</h3>
              <p>
                Today, I would explore semantic search or retrieval-augmented
                generation as another use of structured content. Retrieval would
                need approved, versioned sources, preserved source IDs and
                grounded citations.
              </p>
              <p>
                Any clinical use would require appropriate human review and
                explicit handling of missing or conflicting evidence. This is a
                future exploration, separate from the shipped content system and
                deterministic calculators.
              </p>
            </div>
          </div>
        </Section>
      </main>
      <footer>
        <div>
          <b>Impella / Architecture as a product decision.</b>
          <p>
            Independent portfolio case study. Product names and imagery belong
            to their respective owners.
            <br />
            Original evidence, descriptive source summaries and educational
            reconstructions are labeled throughout.
          </p>
        </div>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
