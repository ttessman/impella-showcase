import { useRef } from "react";

const regions = [
  [
    "Article shell",
    "Favorites, an optional PDF attachment and the article title belong to the native layout.",
  ],
  [
    "Authored primary content",
    "Headers, text, media, CTAs, tables and references follow the author-defined order. Dashed outlines reveal the individual component boundaries.",
  ],
  [
    "Related content",
    "A separately authored list of resource relationships renders as cards below the article body.",
  ],
];
const alt =
  "Original article documentation diagram with dashed outlines separating article actions and title, authored image, text, CTA, video, table, references and related-content cards";

export function ArticleEvidence() {
  const dialog = useRef<HTMLDialogElement>(null);
  const source = `${import.meta.env.BASE_URL}assets/documentation/article_diagram_screenshot.png`;
  return (
    <>
      <figure className="original-article-evidence">
        <div>
          <div
            className="original-article-viewport"
            tabIndex={0}
            role="region"
            aria-label="Scrollable original article layout diagram"
          >
            <img
              src={source}
              width="1980"
              height="7240"
              loading="lazy"
              alt={alt}
            />
          </div>
          <button
            type="button"
            className="original-diagram-zoom"
            onClick={() => dialog.current?.showModal()}
          >
            Enlarge original article diagram ↗
          </button>
        </div>
        <div className="original-article-notes">
          <p className="eyebrow">ORIGINAL PROJECT DOCUMENTATION</p>
          <h3>See where the components meet the page.</h3>
          <p>
            This original authoring diagram connects the content contract to an
            article layout. Scroll the image to follow the authored blocks down
            to references and related resources.
          </p>
          <ol>
            {regions.map(([title, text]) => (
              <li key={title}>
                <b>{title}</b>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="note">
            The historical example includes publication metadata. The archived
            renderer later disables that bundle, so the image illustrates a
            documented layout rather than every behavior in the checked source
            version.
          </p>
          <figcaption>
            Original artifact:{" "}
            <code>docs/static/img/article_diagram_screenshot.png</code>,
            referenced by <code>architecture/content/articles.md</code>.
            Included with the contributor’s permission. The source image and its
            aspect ratio are preserved.
          </figcaption>
        </div>
      </figure>
      <dialog
        ref={dialog}
        className="image-dialog article-diagram-dialog"
        aria-labelledby="article-diagram-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-toolbar">
          <h3 id="article-diagram-dialog-title">
            Original article layout diagram
          </h3>
          <button
            type="button"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Close diagram ×
          </button>
        </div>
        <p className="small">
          Original project documentation · Scroll to inspect each outlined
          component.
        </p>
        <img src={source} width="1980" height="7240" alt={alt} />
        <a className="text-link" href={source} target="_blank" rel="noreferrer">
          Open source image at original resolution ↗
        </a>
      </dialog>
    </>
  );
}
