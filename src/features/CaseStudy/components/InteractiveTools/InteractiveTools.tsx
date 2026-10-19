import { Card } from "../../../../components/card/Card/Card";
import { ChecklistDialog } from "../../../../components/forms/Checklist/ChecklistDialog";
import { checklistExample } from "../../../../content/checklistExample";
import { Diagram } from "../../../../components/diagrams/Diagram/Diagram";
import { SourceReference } from "../../../../components/source/SourceReference/SourceReference";
import { EvidenceScreenshot } from "../../../../components/media/EvidenceScreenshot/EvidenceScreenshot";
import { toolExperiences } from "../../../../content/toolExperiences";

export function InteractiveTools() {
  return (
    <>
      <div className="tool-experiences">
        {toolExperiences.map((tool) => (
          <Card
            key={tool.kind}
            slots={{
              header: <h3>{tool.title}</h3>,
              content: (
                <div className="tool-example">
                  <EvidenceScreenshot definition={tool.evidence} />
                  <div className="tool-description">
                    <p>{tool.body}</p>
                    <details className="tool-implementation">
                      <summary>{tool.disclosure}</summary>
                      <Diagram kind={tool.kind} />
                    </details>
                    {tool.kind === "checklist" && (
                      <ChecklistDialog definition={checklistExample} />
                    )}
                  </div>
                </div>
              ),
              footer: <SourceReference source={tool.source} />,
            }}
          />
        ))}
      </div>
    </>
  );
}
