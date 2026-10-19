import { navigationExamples } from "../../../content/evidence";

export function NavigationEvidence() {
  return (
    <div className="navigation-evidence">
      {navigationExamples.map((example) => {
        const source = `${import.meta.env.BASE_URL}assets/production/${example.file}`;
        return (
          <figure key={example.file}>
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${example.title} screenshot at full size`}
            >
              <img
                src={source}
                width={example.width}
                height={example.height}
                loading="lazy"
                alt={example.alt}
              />
            </a>
            <figcaption>
              <p className="eyebrow">{example.source}</p>
              <h3>{example.title}</h3>
              <p>{example.body}</p>
              <a
                className="text-link"
                href={source}
                target="_blank"
                rel="noreferrer"
              >
                View screenshot ↗
              </a>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
