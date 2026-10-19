import { Diagram } from "../../../../components/diagrams/Diagram/Diagram";
import { SourceReference } from "../../../../components/source/SourceReference/SourceReference";
import { EvidenceScreenshot } from "../../../../components/media/EvidenceScreenshot/EvidenceScreenshot";
import { caseStudyCopy } from "../../../../content/caseStudy";
import { toolExperiences } from "../../../../content/toolExperiences";

export function InteractiveTools() {
  const copy = caseStudyCopy.tools;
  return (
    <>
      <div className="tool-experiences">
        {toolExperiences.map((tool) => (
          <article key={tool.kind}>
            <h3>{tool.title}</h3>
            <div className="tool-example">
              <EvidenceScreenshot definition={tool.evidence} />
              <p>{tool.body}</p>
            </div>
            <details className="tool-implementation">
              <summary>{tool.disclosure}</summary>
              <Diagram kind={tool.kind} />
              <SourceReference source={tool.source} />
            </details>
          </article>
        ))}
      </div>
      <div className="tool-value">
        <h3>{copy.valueTitle}</h3>
        <p>{copy.value}</p>
      </div>
      <p className="note">{copy.clinicalBoundary}</p>
    </>
  );
}
