import { ImageDialog } from "../ImageDialog/ImageDialog";
import { useState } from "react";
import { screenshots } from "../../../content/evidence";
export function ProductGallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(screenshots[0]);
  return (
    <>
      <div className="product-gallery">
        {screenshots.map((shot, index) => (
          <figure key={shot.file} className="product-shot">
            <button
              className="screenshot-button"
              type="button"
              aria-label={`Enlarge ${shot.title} screenshot`}
              onClick={() => {
                setActive(shot);
                setOpen(true);
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/production/${shot.file}`}
                alt={shot.alt}
                loading="lazy"
                width={shot.file.endsWith("webp") ? 460 : 1260}
                height={shot.file.endsWith("webp") ? 996 : 2736}
              />
              <span>View full size ↗</span>
            </button>
            <figcaption>
              <span className="eyebrow">
                0{index + 1} /{" "}
                {shot.file.startsWith("apple-")
                  ? "Apple listing"
                  : "Supplied capture"}
              </span>
              <h3>{shot.title}</h3>
              <p>{shot.body}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <ImageDialog
        state={{ open, onOpenChange: setOpen }}
        title={active.title}
        image={{
          src: `${import.meta.env.BASE_URL}assets/production/${active.file}`,
          alt: active.alt,
          width: active.file.endsWith("webp") ? 460 : 1260,
          height: active.file.endsWith("webp") ? 996 : 2736,
        }}
      />
    </>
  );
}
