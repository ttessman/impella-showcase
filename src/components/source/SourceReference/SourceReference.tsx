import { Button } from "../../actions/Button/Button";
import { PreviewPopover } from "../../overlays/PreviewPopover/PreviewPopover";
import type { SourceReferenceData } from "../../../types/sourceReference";

/** Source-specific content composes the shared preview interaction. */
export function SourceReference({ source }: { source: SourceReferenceData }) {
  return (
    <div className="source-note source-reference">
      <PreviewPopover
        title={source.title}
        className="source-reference-popup"
        slots={{
          trigger: (
            <Button className="source-reference-trigger">
              Source: {source.paths.join(" · ")}{" "}
              <span aria-hidden="true">&lt;/&gt;</span>
            </Button>
          ),
          body: (
            <>
              <p>{source.summary}</p>
              <pre
                tabIndex={0}
                aria-label={`${source.title} illustrative code`}
              >
                <code>{source.example}</code>
              </pre>
            </>
          ),
          footer: (
            <p className="source-reference-disclaimer">
              Independently written illustration · Not original Impella source
              code.
            </p>
          ),
        }}
      />
    </div>
  );
}
