import { useState } from "react";
import { Button } from "../../Button/Button";
import { IconButton } from "../../Button/variants/IconButton";
import { Icon } from "../../Icon/Icon";
import { Dialog } from "../Dialog";
import { DialogClose } from "../DialogClose";
import { Document } from "../../Document/Document";
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
                  <Icon type="close" />
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
