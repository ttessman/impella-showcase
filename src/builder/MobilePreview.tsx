import { useEffect, useRef, useState } from "react";
import type { ContentPage } from "./model";
import { ContentRenderer } from "./ContentRenderer";

const DEVICE = { width: 390, height: 844 };
export function MobilePreview({
  page,
  compact,
}: {
  page: ContentPage;
  compact: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(
        Math.max(
          0.01,
          Math.min(
            (compact ? 300 : 320) / DEVICE.width,
            width / DEVICE.width,
            height / DEVICE.height,
          ),
        ),
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [compact]);
  return (
    <div className="preview-pane">
      <h3>
        <span>03</span> Mobile preview
      </h3>
      <div ref={stage} className="preview-device-stage">
        <div
          className="preview-device-fit"
          style={{ width: DEVICE.width * scale, height: DEVICE.height * scale }}
        >
          <div
            className="phone-preview"
            style={{
              width: DEVICE.width,
              height: DEVICE.height,
              maxWidth: "none",
              maxHeight: "none",
              flex: "none",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="phone-top">
              <span>9:41</span>
              <span aria-hidden="true">● ● ●</span>
            </div>
            <div className="preview-brand">
              FIELD NOTES <span>Demo journal</span>
            </div>
            <article
              className="preview-content"
              aria-label="Mobile content preview"
            >
              <h2>{page.title}</h2>
              <ContentRenderer blocks={page.primary_content_value} />
            </article>
            <div className="phone-bottom">Independent web renderer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
