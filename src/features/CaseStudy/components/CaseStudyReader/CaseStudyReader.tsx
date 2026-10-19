import { useState } from "react";
import { Button } from "../../../../components/actions/Button/Button";
import { IconButton } from "../../../../components/actions/IconButton/IconButton";
import { WorkspaceIcon } from "../../../../components/icons/WorkspaceIcon/WorkspaceIcon";
import {
  Dialog,
  DialogClose,
} from "../../../../components/overlays/Dialog/Dialog";
import { Document } from "../../../../components/content/Document/Document";
import { caseStudyReader } from "../../../../content/caseStudyReader";
import { useClientReady } from "../../../../hooks/useClientReady";

export function CaseStudyReader() {
  const [open, onOpenChange] = useState(false);
  const ready = useClientReady();
  return (
    <>
      <a
        className="footer-reader-link"
        href="./case-study.txt"
        aria-haspopup={ready ? "dialog" : undefined}
        onClick={(event) => {
          if (
            ready &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
          ) {
            event.preventDefault();
            onOpenChange(true);
          }
        }}
      >
        Read case-study summary ↗
      </a>
      <Dialog
        state={{ open, onOpenChange }}
        definition={{
          title: "Case-study summary",
          description:
            "A reading and printing view of the project’s architecture and individual contribution.",
        }}
        className="case-study-reader"
        slots={{
          header: <h3>Case-study summary</h3>,
          actions: (
            <>
              <Button className="reader-print" onClick={() => window.print()}>
                Print / Save as PDF
              </Button>
              <DialogClose asChild>
                <IconButton
                  label="Close case-study summary"
                  onEscape={() => onOpenChange(false)}
                >
                  <WorkspaceIcon name="close" />
                </IconButton>
              </DialogClose>
            </>
          ),
          body: <Document definition={caseStudyReader} />,
          footer: (
            <a className="reader-download" href="./case-study.txt" download>
              Download plain text ↗
            </a>
          ),
        }}
      />
    </>
  );
}
