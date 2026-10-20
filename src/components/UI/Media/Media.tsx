import { Icon } from "../Icon/Icon";
import type { EvidenceImage } from "../Dialog/variants/ImageDialog";
export type MediaDefinition = {
  image: EvidenceImage;
  title: string;
  variant: "hero" | "original" | "linked" | "evidence" | "gallery" | "inline";
  body?: string;
  captionLabel?: string;
  triggerLabel?: string;
  closeLabel?: string;
  originalLinkLabel?: string;
};

import { useState } from "react";
import type { ReactNode } from "react";
import { ImageDialog } from "../Dialog/variants/ImageDialog";
export function Media({
  definition,
  caption,
}: {
  definition: MediaDefinition;
  caption: ReactNode;
}) {
  const [open, onOpenChange] = useState(false);
  const m = definition;
  const image = m.image;
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
          <span>{caption}</span>
        </figcaption>
      </figure>
    );
  if (m.variant === "linked")
    return (
      <a
        href={image.src}
        target="_blank"
        rel="noreferrer"
        aria-label={m.triggerLabel}
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
            {m.triggerLabel}
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
            <span>
              View full size <Icon type="external" size={12} />
            </span>
          </button>
          <figcaption>
            {m.variant === "gallery" ? (
              <>
                <span className="eyebrow">{m.captionLabel}</span>
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
        closeLabel={m.closeLabel}
        className={m.variant === "original" ? "article-diagram-dialog" : ""}
        caption={m.variant === "original" ? m.captionLabel : undefined}
        footer={
          m.originalLinkLabel ? (
            <a
              className="text-link"
              href={image.src}
              target="_blank"
              rel="noreferrer"
            >
              {m.originalLinkLabel}
            </a>
          ) : undefined
        }
      />
    </>
  );
}
