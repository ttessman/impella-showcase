import { publicEvidence } from "../../../../content/publicEvidence";

/** Release facts remain visibly separate from personal ownership and architectural benefits. */
export function PublicEvidence() {
  return (
    <div className="public-evidence" aria-labelledby="public-evidence-title">
      <h3 id="public-evidence-title">{publicEvidence.title}</h3>
      <ul className="public-evidence-list">
        {publicEvidence.items.map((item) => (
          <li key={item.title}>
            <p className="eyebrow">{item.label}</p>
            <div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
              <p className="public-evidence-sources">
                {item.sources.map((source) => (
                  <a key={source.title} href={source.href}>
                    {source.title} ↗
                  </a>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="note">{publicEvidence.note}</p>
    </div>
  );
}
