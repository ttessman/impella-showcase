import type { CSSProperties } from "react";
import { SourceCodePreview } from "./SourceCodePreview";
import { Button } from "../../../actions/Button/Button";
import { PreviewPopover } from "../../../overlays/PreviewPopover/PreviewPopover";
import type { SourceReferenceData } from "../../../../types/sourceReference";

/** Source-specific content composes the shared preview interaction. */
export function SourceReferenceView({
  source,
}: {
  source: SourceReferenceData;
}) {
  const longestFile = Math.max(
    ...source.files.map((file) => file.example.split("\n").length),
  );
  const height = Math.min(380, Math.max(260, longestFile * 18 + 120));
  return (
    <div className="source-note source-reference">
      <PreviewPopover
        title={source.title}
        className="source-reference-popup"
        anchor="start"
        style={{ "--source-preview-height": `${height}px` } as CSSProperties}
        slots={{
          trigger: (
            <Button className="source-reference-trigger">
              Source: {source.files[0].path}
              {source.files.length > 1 && (
                <>
                  {" "}
                  · +{source.files.length - 1}{" "}
                  {source.files.length === 2 ? "file" : "files"}
                </>
              )}{" "}
              <span aria-hidden="true">&lt;/&gt;</span>
            </Button>
          ),
          body: <SourceCodePreview source={source} />,
          footer: (
            <p className="source-reference-disclaimer">{source.disclaimer}</p>
          ),
        }}
      />
    </div>
  );
}
