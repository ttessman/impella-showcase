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
              Source: {source.paths[0]}
              {source.paths.length > 1 && (
                <>
                  {" "}
                  · +{source.paths.length - 1}{" "}
                  {source.paths.length === 2 ? "file" : "files"}
                </>
              )}{" "}
              <span aria-hidden="true">&lt;/&gt;</span>
            </Button>
          ),
          body: (
            <>
              <p>{source.summary}</p>
              <dl
                className="source-reference-files"
                aria-label="Source file guide"
              >
                {source.paths.map((path) => (
                  <div key={path}>
                    <dt>
                      <code>{path}</code>
                    </dt>
                    {source.fileNotes?.[path] && (
                      <dd>{source.fileNotes[path]}</dd>
                    )}
                  </div>
                ))}
              </dl>
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
