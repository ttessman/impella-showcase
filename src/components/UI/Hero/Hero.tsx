import type { ReactNode } from "react";
import { RichText } from "../Text/RichText";

/** Owns the editorial composition; authored areas arrive as ordinary React children. */
export function Hero({
  id,
  header,
  areas,
}: {
  id?: string;
  header: { eyebrow?: string; title: string; tags?: readonly string[] };
  areas: {
    content: ReactNode;
    actions?: ReactNode;
    aside?: ReactNode;
    footer?: ReactNode;
  };
}) {
  return (
    <div className="hero-band">
      <div id={id} className="hero">
        <div className="hero-copy">
          <header>
            {header.eyebrow && (
              <p className="eyebrow">
                <RichText text={header.eyebrow} />
              </p>
            )}
            <h1>
              <RichText text={header.title} />
            </h1>
            {!!header.tags?.length && (
              <ul className="hero-tags" aria-label="Project tags">
                {header.tags.map((tag, index) => (
                  <li key={index}>
                    <RichText text={tag} />
                  </li>
                ))}
              </ul>
            )}
          </header>
          <div className="hero-authored-content">{areas.content}</div>
          {areas.actions && <div className="hero-actions">{areas.actions}</div>}
        </div>
        {areas.aside && <div className="hero-aside">{areas.aside}</div>}
      </div>
      {areas.footer}
    </div>
  );
}
