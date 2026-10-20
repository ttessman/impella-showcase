import { useState } from "react";
import { Button } from "../../../actions/Button/Button";
import { IconButton } from "../../../actions/IconButton/IconButton";
import { WorkspaceIcon } from "../../../icons/WorkspaceIcon/WorkspaceIcon";
import { Dialog } from "../../../overlays/Dialog/Dialog";
import { DialogClose } from "../../../overlays/Dialog/DialogClose";
import { Document } from "../../../content/Document/Document";
import type { ComponentProps } from "react";
import { useClientReady } from "../../../../hooks/useClientReady";

export function ReaderDialog({
  definition,
  label = "Read case-study summary ↗",
}: {
  definition: ComponentProps<typeof Document>["definition"];
  label?: string;
}) {
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
        {label}
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
          body: <Document definition={definition} />,
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
