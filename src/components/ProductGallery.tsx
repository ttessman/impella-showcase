import { useRef, useState } from "react";
import { screenshots } from "../data/caseStudy";
export function ProductGallery() {
  const dialog = useRef<HTMLDialogElement>(null);
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
                dialog.current?.showModal();
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
      <dialog
        ref={dialog}
        className="image-dialog"
        aria-labelledby="image-dialog-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-toolbar">
          <h3 id="image-dialog-title">{active.title}</h3>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            autoFocus
          >
            Close screenshot ×
          </button>
        </div>
        <img
          src={`${import.meta.env.BASE_URL}assets/production/${active.file}`}
          alt={active.alt}
          width={active.file.endsWith("webp") ? 460 : 1260}
          height={active.file.endsWith("webp") ? 996 : 2736}
        />
      </dialog>
    </>
  );
}
