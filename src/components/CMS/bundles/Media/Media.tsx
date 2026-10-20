import { useState } from "react";
import type { NodeOf } from "../../../../types/cms";
import { ContentView } from "../../renderers/ContentView";
import { textContent } from "../../model/document";
import { EvidenceScreenshot } from "./EvidenceScreenshot";
import { ImageDialog } from "../../../overlays/ImageDialog/ImageDialog";

import { assetUrl } from "../../utils/assets";
/** One media capability owns enlargement; layout variants reuse the image dialog. */
export function Media({ node }: { node: NodeOf<"media"> }) {
  const [open, onOpenChange] = useState(false);
  const m = node.metadata;
  const image = {
    src: assetUrl(m.src),
    alt: m.alt,
    width: m.width,
    height: m.height,
  };
  const caption = <ContentView blocks={node.content} />;
  if (m.variant === "evidence")
    return (
      <EvidenceScreenshot
        definition={{
          title: m.title,
          image,
          caption: node.content.map(textContent).join(""),
        }}
      />
    );
  const img = (
    <img
      {...image}
      loading={m.variant === "hero" ? "eager" : "lazy"}
      fetchPriority={m.variant === "hero" ? "high" : undefined}
    />
  );
  if (m.variant === "hero")
    return (
      <figure className="hero-evidence">
        <div className="hero-grid-lines" aria-hidden="true" />
        {img}
        <figcaption>
          {m.title}
          <br />
          <span>{node.content.map(textContent).join("")}</span>
        </figcaption>
      </figure>
    );
  if (m.variant === "linked")
    return (
      <a
        href={image.src}
        target="_blank"
        rel="noreferrer"
        aria-label={m.trigger_label}
      >
        {img}
      </a>
    );
  if (m.variant === "inline")
    return (
      <figure>
        {img}
        <figcaption>{caption}</figcaption>
      </figure>
    );
  return (
    <>
      {m.variant === "original" ? (
        <>
          <div className="original-article-viewport">{img}</div>
          <button
            type="button"
            className="original-diagram-zoom"
            onClick={() => onOpenChange(true)}
          >
            {m.trigger_label}
          </button>
        </>
      ) : (
        <figure
          className={
            m.variant === "gallery" ? "product-shot" : "evidence-screenshot"
          }
        >
          <button
            className={
              m.variant === "gallery" ? "screenshot-button" : undefined
            }
            type="button"
            aria-label={`Enlarge ${m.title} screenshot`}
            onClick={() => onOpenChange(true)}
          >
            {img}
            <span>View full size ↗</span>
          </button>
          <figcaption>
            {m.variant === "gallery" ? (
              <>
                <span className="eyebrow">{m.caption_label}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </>
            ) : (
              caption
            )}
          </figcaption>
        </figure>
      )}
      <ImageDialog
        state={{ open, onOpenChange }}
        title={m.title}
        image={image}
        closeLabel={m.close_label}
        className={m.variant === "original" ? "article-diagram-dialog" : ""}
        caption={m.variant === "original" ? m.caption_label : undefined}
        footer={
          m.original_link_label ? (
            <a
              className="text-link"
              href={image.src}
              target="_blank"
              rel="noreferrer"
            >
              {m.original_link_label}
            </a>
          ) : undefined
        }
      />
    </>
  );
}
