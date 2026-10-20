import { studioNode } from "../../model/toCmsBundle";
import { useElementSize } from "../../../../hooks/useElementSize";
import { useRef } from "react";
import type { StudioDocument } from "../../model/studioDocument";
import { ContentView } from "../../../../components/CMS/renderers/ContentView";

const DEVICE = { width: 390, height: 844 };
export function MobilePreview({
  page,
  compact,
}: {
  page: StudioDocument;
  compact: boolean;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const { width, height } = useElementSize(stage);
  const scale = Math.max(
    0.01,
    Math.min(
      (compact ? 300 : 320) / DEVICE.width,
      width / DEVICE.width,
      height / DEVICE.height,
    ),
  );
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
              <ContentView
                blocks={page.primary_content_value.map(studioNode)}
              />
            </article>
            <div className="phone-bottom">Independent web renderer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
