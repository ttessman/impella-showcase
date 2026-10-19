import {
  articleDiagram,
  collectionDiagram,
  flowDiagrams,
} from "../../../content/diagrams";

type DiagramKind = keyof typeof flowDiagrams | "article" | "collections";
export function Diagram({ kind }: { kind: DiagramKind }) {
  if (kind === "article") return <ArticleModel />;
  if (kind === "collections") return <CollectionLayouts />;
  const definition = flowDiagrams[kind];
  return (
    <figure
      className={kind === "pipeline" ? "architecture-figure" : "anatomy-figure"}
    >
      {definition.label && (
        <div className="diagram-label">{definition.label}</div>
      )}
      <ol className={definition.listClass}>
        {definition.steps.map(([title, body], index) => (
          <li key={title}>
            {kind === "pipeline" ? (
              <>
                <span className="diagram-index">0{index + 1}</span>
                <strong>{title}</strong>
              </>
            ) : (
              <b>{title}</b>
            )}
            <span>{body}</span>
          </li>
        ))}
      </ol>
      <figcaption>{definition.caption}</figcaption>
    </figure>
  );
}
function ArticleModel() {
  const definition = articleDiagram;
  return (
    <figure className="anatomy-figure">
      <div className="diagram-label">{definition.label}</div>
      <div className="anatomy-grid">
        <div className="diagram-stack">
          {definition.regions.map((region) => (
            <div key={region.label} className={`diagram-box ${region.tone}`}>
              <span>{region.label}</span>
              {region.titles.map((title) => (
                <strong key={title}>{title}</strong>
              ))}
              <small>{region.detail}</small>
            </div>
          ))}
        </div>
        <div className="diagram-annotation">
          {definition.annotations.map((note) => (
            <p key={note.title}>
              <b>{note.title}</b> {note.body}
            </p>
          ))}
        </div>
      </div>
      <figcaption>{definition.caption}</figcaption>
    </figure>
  );
}
function CollectionLayouts() {
  const definition = collectionDiagram;
  return (
    <figure className="anatomy-figure">
      <div className="diagram-label">{definition.label}</div>
      <div className="collection-diagram">
        <div>
          <h4>{definition.continuous.title}</h4>
          <p className="small">{definition.heading}</p>
          {definition.continuous.cards.map((card) => (
            <div className="resource-placeholder" key={card}>
              {card}
            </div>
          ))}
          <p className="small">{definition.continuous.footer}</p>
        </div>
        <div>
          <h4>{definition.grouped.title}</h4>
          <p className="small">{definition.heading}</p>
          {definition.grouped.groups.map((group) => (
            <div key={group}>
              <div className="group-heading">
                {group} <span>{definition.grouped.action}</span>
              </div>
              <div className="resource-placeholder">
                {definition.grouped.cards}
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption>{definition.caption}</figcaption>
    </figure>
  );
}
