import type { DialogSize } from "../Dialog/Dialog";
import { Icon } from "../Icon/Icon";
import type { EvidenceImage } from "../Dialog/variants/ImageDialog";
import { ImageDialogTrigger } from "../Dialog/variants/ImageDialogTrigger";
export type MediaDefinition = {
  dialog?: { title?: string; closeLabel?: string; size?: DialogSize };
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
  "data-bundle-name": bundleName,
  definition,
  caption,
}: {
  "data-bundle-name"?: string;
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
      <figure data-bundle-name={bundleName} className="hero-evidence">
        <div className="hero-grid-lines" aria-hidden="true" />
        {img}
        <figcaption>
          {m.title}
          <br />
          <span>{caption}</span>
        </figcaption>
      </figure>
    );
  if (m.variant === "linked" && m.dialog)
    return (
      <ImageDialogTrigger
        data-bundle-name={bundleName}
        image={image}
        title={m.dialog.title ?? m.title}
        closeLabel={m.dialog.closeLabel ?? m.closeLabel ?? "Close screenshot"}
        size={m.dialog.size}
        label={m.triggerLabel}
        className="image-dialog-trigger"
      >
        {img}
      </ImageDialogTrigger>
    );
  if (m.variant === "linked")
    return (
      <a
        data-bundle-name={bundleName}
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
      <figure data-bundle-name={bundleName}>
        {img}
        <figcaption>{caption}</figcaption>
      </figure>
    );
  return (
    <>
      {m.variant === "original" ? (
        <>
          <div
            data-bundle-name={bundleName}
            className="original-article-viewport"
          >
            {img}
          </div>
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
          data-bundle-name={bundleName}
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
        title={m.dialog?.title ?? m.title}
        size={m.dialog?.size ?? (m.variant === "original" ? "large" : "small")}
        image={image}
        closeLabel={m.dialog?.closeLabel ?? m.closeLabel}
        className={m.variant === "original" ? "article-diagram-dialog" : ""}
        caption={m.variant === "original" ? m.captionLabel : undefined}
        footer={
          m.originalLinkLabel ? (
            <a
              data-bundle-name={bundleName}
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
