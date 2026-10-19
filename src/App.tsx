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
      <header className="site-header">
        <a href="#top" className="wordmark">
          TYLER TESSMANN<span>Design engineering / Selected work</span>
        </a>
        <nav aria-label="Case study">
          <a href="#architecture">Architecture</a>
          <a href="#product">Product</a>
          <a className="nav-demo" href="#playground">
            Try the builder <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main">
        <div id="top" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">CASE STUDY / MOBILE CONTENT ARCHITECTURE</p>
            <h1>
              Content, composed
              <br />
              <em>natively.</em>
            </h1>
            <p className="hero-summary">
              A structured publishing system for the Impella app. Drupal for the
              authors. React Native for the experience.
            </p>
            <p className="hero-detail">
              I challenged a full-page webview proposal, defined the content
              contracts, and built a reusable native renderer so authors could
              compose supported content without hand-coding every page.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#architecture">
                Explore the architecture <span aria-hidden="true">↓</span>
              </a>
              <a className="text-link" href="#playground">
                Build a sample page ↗
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
              Evolving content.
              <br />A consistent mobile experience.
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
              Architecture, contracts, renderer,
              <br />
              sample pages & documentation.
            </p>
          </div>
        </div>
        <Section
          id="overview"
          number="01"
          label="Context & ownership"
          title="Two experiences to design for."
          intro="Clinical professionals needed access to reference material and tools. Content authors needed a dependable way to maintain those resources."
        >
          <div className="two-column">
            <p>
              The Impella clinical mobile application brings together articles,
              media, instructions for use and interactive tools for healthcare
              professionals. This case study focuses on the boundary between
              Drupal authoring and the native mobile interface.
            </p>
            <div>
              <p>
                My work covered the alternative frontend architecture, JSON
                schema, typed rendering system, reusable composition patterns,
                example pages and authoring documentation.
              </p>
              <p className="note">
                The wider team delivered the product, CMS services, clinical
                content and other application features. I do not claim sole
                authorship of the application or all production content.
                Responsibilities are contributor-provided; the repository
                corroborates the technical mechanisms.
              </p>
            </div>
          </div>
        </Section>
        <Section
          id="architecture"
          number="02"
          label="The architectural decision"
          title="Keep the CMS. Give the interface a native contract."
          intro="The initial proposal used full CMS webpages inside webviews. I proposed exchanging structured content instead, with supported bundles dispatched to reusable React Native components."
        >
          <div className="decision-grid">
            <article>
              <p className="eyebrow">INITIAL PROPOSAL</p>
              <h3>Web pages inside the app</h3>
              <p>
                CMS markup would own more of the presentation. This can simplify
                reuse of web content, but adds a second page layout and
                interaction environment to coordinate with the native
                application.
              </p>
            </article>
            <article>
              <p className="eyebrow">PROPOSED & IMPLEMENTED</p>
              <h3>Content interpreted by the app</h3>
              <p>
                Authors compose supported structures. The app owns their
                presentation and interactions. The tradeoff: every new bundle
                needs a contract and renderer, and schema changes require
                coordination.
              </p>
            </article>
          </div>
          <Diagram kind="pipeline" />
          <p className="note">
            The decision prioritized composition and UI control. No measured
            performance improvement or clinical outcome is asserted.
          </p>
        </Section>
        <Section
          id="contract"
          number="03"
          label="Content architecture"
          title="A small contract. A reusable rendering system."
          intro="Content records describe what a page contains. A dispatch layer decides which native component renders each authored bundle."
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
          intro="The authoring documentation defines six primary article bundles: Text Block, Media, CTA Block, Header, References Accordion and Table. Authors arrange them within the article’s primary content region."
        >
          <ArticleEvidence />
          <Diagram kind="article" />
          <div className="two-column">
            <p>
              The native shell establishes consistent actions, title and layout
              conventions. Related resources are authored separately and
              rendered as cards after primary content. The documentation
              describes optional date/read-time display; the archived
              BundleRender disables article_info, so that detail is not treated
              as shipped behavior.
            </p>
            <p>
              Text markup is interpreted by native HTML rendering primitives;
              media, references and actions use dedicated components. This
              separates authoring from rendering while keeping each supported
              block’s behavior explicit.
            </p>
          </div>
        </Section>
        <Section
          id="collections"
          number="05"
          label="Dynamic collections"
          title="Shared resources. Different reading paths."
          intro="Drupal taxonomy brings articles, checklists and calculators into collections. A collection has a title, optional heading components, and a list of resource groups."
        >
          <Diagram kind="collections" />
          <div className="two-column">
            <p>
              In the archived implementation, <code>CollectionContent</code>{" "}
              enables grouping when <code>collection_values.length &gt; 1</code>
              , then passes that choice to <code>CollectionBlock</code>. A
              single group uses continuous pagination; multiple groups use
              labeled previews and View More.
            </p>
            <p>
              The documentation guides authors to use tags and grouping labels.
              The same typed resource references feed shared cards; presentation
              changes the grouping and reveal behavior rather than creating a
              different resource model for each layout.
            </p>
          </div>
          <p className="source-note">
            Source: components/CollectionContent · CMS/CollectionBlock ·
            docs/docs/architecture/content/collections.md
          </p>
        </Section>
        <Section
          id="navigation"
          number="06"
          label="Dynamic navigation"
          title="Navigation was content configuration, too."
          intro="An authored menus endpoint describes regional destinations, labels, icons and ordering. The frontend resolves those records into supported routes."
        >
          <Diagram kind="navigation" />
          <div className="two-column">
            <p>
              Landing screens also support role and specialty targeting,
              weighted selection, up to six authored collection tiles and
              featured content. Favorites are user-generated; the optional
              Browse preview comes from an authored collection.
            </p>
            <p>
              The supplied Browse capture shows Favorites, Browse, Tools and
              IFUs tabs. The Apple listing image shows the six-tile landing
              pattern described by the archived documentation. This supports
              discussing flexibility, but does not establish how any later
              production change was deployed. New route types and native
              behavior still need application code.
            </p>
          </div>
          <p className="source-note">
            Source: hooks/useTabNavigatorScreens.tsx · architecture/menus.md ·
            content/landingScreens.md
          </p>
        </Section>
        <Section
          id="tools"
          number="07"
          label="Interactive content"
          title="Structured interactions, with explicit boundaries."
          intro="Checklists model more than page layout: heading components, grouped questions, result-display conditions, references and disclaimer copy."
        >
          <div className="tools-grid">
            <Diagram kind="checklist" />
            <div>
              <h3>Authored rules, native behavior</h3>
              <p>
                Labels, options and spacers compose question accordions.
                Authored operators and required checkbox combinations select
                result components. The documentation asks authors to cover
                possible input combinations; it is not evidence that every
                clinical rule was validated by me.
              </p>
              <h3>Calculators are a separate implementation</h3>
              <p>
                AKI, PAPi, CPO and heparin calculators use purpose-built
                components and deterministic helpers under{" "}
                <code>src/util/</code>. Their content values have a fixed order
                expected by those components. They are part of the product, not
                arbitrary CMS compositions.
              </p>
              <p className="note">
                The playground below contains no clinical rules, calculations or
                medical guidance. No LLM performs medical calculations.
              </p>
            </div>
          </div>
        </Section>
        <Section
          id="product"
          number="08"
          label="Production application"
          title="The architecture becomes an experience."
          intro="Supplied product screenshots connect resource records, article regions and dedicated tools to the visible application. Select an image to inspect it at full size."
        >
          <ProductGallery />
          <p className="note">
            Screenshots from the supplied case study and user-provided Apple
            listing images; capture dates and application versions are
            unverified. Later product changes and individual tools are not
            claimed as solely my work. Internal authoring screenshots remain
            reference-only.
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
          label="Deliverables & ownership"
          title="A system other people could author with."
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
            The delivered experience was a team outcome. This contribution
            centers on the content-to-interface architecture and author
            enablement.
          </p>
        </Section>
        <Section
          id="playground"
          number="10"
          label="Try the architecture"
          title="Compose a page. Inspect the contract."
          intro="Add a block, select it to edit, change its order, or choose a section as the destination for nested content. The same validated object drives the editor, JSON and simulated mobile view."
          tone="demo-section"
        >
          <Playground />
        </Section>
        <Section
          id="reflection"
          number="11"
          label="Reflection & future evolution"
          title="The lasting value is a clear boundary."
        >
          <div className="two-column">
            <div>
              <h3>What this architecture makes possible</h3>
              <p>
                A typed contract gives authors a defined vocabulary and
                developers a predictable rendering surface. Reusable components
                centralize presentation, while examples and documentation make
                composition understandable to people outside the frontend team.
              </p>
              <p>
                The cost is stewardship: schema changes, new bundles and
                authoring guidance must evolve together. TypeScript helps
                development; runtime validation is still needed at a content
                boundary.
              </p>
            </div>
            <div className="future-concept">
              <p className="eyebrow">FUTURE CONCEPT / NOT SHIPPED</p>
              <h3>Source-grounded discovery</h3>
              <p>
                Structured content could support semantic search or
                retrieval-augmented generation over approved, versioned sources.
                A retrieval layer should preserve source IDs, approval status,
                versions and direct citations.
              </p>
              <p>
                Any proposed clinical AI would need appropriate human review,
                explicit handling of missing or conflicting evidence and
                separate validation. Existing calculators remain deterministic
                tools. This is a future exploration, not delivered
                functionality.
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
