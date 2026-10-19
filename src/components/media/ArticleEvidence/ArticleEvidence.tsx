import { ImageDialog } from "../ImageDialog/ImageDialog";
import { useState } from "react";
import { Diagram } from "../../diagrams/Diagram/Diagram";

const alt =
  "Original article documentation diagram with dashed outlines separating article actions and title, authored image, text, CTA, video, table, references and related-content cards";

export function ArticleEvidence() {
  const [open, setOpen] = useState(false);
  const source = `${import.meta.env.BASE_URL}assets/documentation/article_diagram_screenshot.png`;
  return (
    <>
      <figure className="original-article-evidence">
        <div>
          <div className="original-article-viewport">
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
            onClick={() => setOpen(true)}
          >
            Enlarge original article diagram ↗
          </button>
        </div>
        <div className="original-article-notes">
          <p className="eyebrow">ORIGINAL PROJECT DOCUMENTATION</p>
          <h3>See where the components meet the page.</h3>
          <p>
            I used documentation like this to make composition tangible for
            authors. Each outlined region shows how a supported component
            contributes to a complete article. Follow the full page from media
            and text to references and related resources, alongside the content
            model that explains its structure.
          </p>
          <Diagram kind="article" />
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
      <ImageDialog
        state={{ open, onOpenChange: setOpen }}
        title="Original article layout diagram"
        closeLabel="Close diagram"
        className="article-diagram-dialog"
        image={{ src: source, width: 1980, height: 7240, alt }}
        caption="Original project documentation · Scroll to inspect each outlined component."
        footer={
          <a
            className="text-link"
            href={source}
            target="_blank"
            rel="noreferrer"
          >
            Open source image at original resolution ↗
          </a>
        }
      />
    </>
  );
}
