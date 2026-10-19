export function Diagram({
  kind,
}: {
  kind: "pipeline" | "article" | "collections" | "checklist" | "navigation";
}) {
  if (kind === "pipeline")
    return (
      <figure className="architecture-figure">
        <ol className="pipeline">
          {[
            ["Drupal", "Authors compose supported fields"],
            ["JSON contract", "Records, bundles & relationships"],
            ["Native dispatch", "ContentView → BundleRender"],
            ["Mobile experience", "Reusable React Native UI"],
          ].map(([a, b], i) => (
            <li key={a}>
              <span className="diagram-index">0{i + 1}</span>
              <strong>{a}</strong>
              <span>{b}</span>
            </li>
          ))}
        </ol>
        <figcaption>
          Independent architecture reconstruction · Based on the original
          content contracts and CMS renderer modules.
        </figcaption>
      </figure>
    );
  if (kind === "article")
    return (
      <figure className="anatomy-figure">
        <div className="diagram-label">ARTICLE / CONTENT MODEL</div>
        <div className="anatomy-grid">
          <div className="diagram-stack">
            <div className="diagram-box fixed">
              <span>Fixed presentation</span>
              <strong>Actions & article title</strong>
              <small>Favorites · optional attachment</small>
            </div>
            <div className="diagram-box authored">
              <span>Primary content / authored order</span>
              <strong>Header → Text → Media</strong>
              <strong>CTA → Table → References</strong>
              <small>Flat primary_content_value array</small>
            </div>
            <div className="diagram-box">
              <span>Separate authored region</span>
              <strong>Related content cards</strong>
              <small>related_content_list</small>
            </div>
          </div>
          <div className="diagram-annotation">
            <p>
              <b>Authoring owns composition.</b> Drupal defines which supported
              bundles appear and in what order.
            </p>
            <p>
              <b>Native UI owns presentation.</b> Reusable components apply
              layout and interaction rules.
            </p>
            <p>
              <b>Nested structures are purposeful.</b> References have a
              references_container; checklist questions contain their own
              component arrays. Generic article sections are not evidenced.
            </p>
          </div>
        </div>
        <figcaption>
          Recreated from architecture/content/articles.md and content.d.ts. The
          original article layout artifact above shows how these regions appear
          on a composed page.
        </figcaption>
      </figure>
    );
  if (kind === "collections")
    return (
      <figure className="anatomy-figure">
        <div className="diagram-label">COLLECTION / TWO PRESENTATIONS</div>
        <div className="collection-diagram">
          <div>
            <h4>Continuous scrolling</h4>
            <p className="small">Title + optional heading components</p>
            <div className="resource-placeholder">Article card</div>
            <div className="resource-placeholder">Calculator card</div>
            <div className="resource-placeholder">Checklist card</div>
            <p className="small">Initial 10 items → reveal more on scroll</p>
          </div>
          <div>
            <h4>Grouped collections</h4>
            <p className="small">Title + optional heading components</p>
            <div className="group-heading">
              Authored grouping label <span>View More →</span>
            </div>
            <div className="resource-placeholder">
              Resource card × up to 3 initially
            </div>
            <div className="group-heading">
              Another authored group <span>View More →</span>
            </div>
            <div className="resource-placeholder">
              Resource card × up to 3 initially
            </div>
          </div>
        </div>
        <figcaption>
          Recreated from architecture/content/collections.md. Shared resource
          records, different list behavior.
        </figcaption>
      </figure>
    );
  if (kind === "navigation")
    return (
      <figure className="anatomy-figure">
        <div className="diagram-label">REGIONAL MENU CONFIGURATION</div>
        <ol className="nav-diagram">
          <li>
            <b>menus.json</b>
            <span>Locale / region, title, icon, weight, link</span>
          </li>
          <li>
            <b>Tab configuration</b>
            <span>useTabNavigatorScreens resolves destinations</span>
          </li>
          <li>
            <b>Content routes</b>
            <span>Collection → Article / Checklist / Calculator</span>
          </li>
        </ol>
        <figcaption>
          Recreated from architecture/menus.md, navigation.md and
          useTabNavigatorScreens.tsx. Application-owned routes remain part of
          the app.
        </figcaption>
      </figure>
    );
  return (
    <figure className="anatomy-figure">
      <div className="diagram-label">CHECKLIST / STRUCTURED INTERACTION</div>
      <ol className="checklist-diagram">
        {[
          ["Heading components", "Optional headers and text"],
          ["Question groups", "Accordion → label + option + spacer"],
          ["Result display logic", "Operator + required checkbox combinations"],
          ["Result components", "Headers and text for matching results"],
          ["Supporting context", "References accordion + disclaimer"],
        ].map(([a, b]) => (
          <li key={a}>
            <b>{a}</b>
            <span>{b}</span>
          </li>
        ))}
      </ol>
      <figcaption>
        Recreated from architecture/content/checklists.md. This explains the
        model; it does not reproduce clinical rules.
      </figcaption>
    </figure>
  );
}
