import { useState } from "react";
import { Button } from "../../actions/Button/Button";
import { IconButton } from "../../actions/IconButton/IconButton";
import { WorkspaceIcon } from "../../icons/WorkspaceIcon/WorkspaceIcon";
import { useChecklist } from "../../../hooks/useChecklist";
import { Dialog, DialogClose } from "../../overlays/Dialog/Dialog";
import { useClientReady } from "../../../hooks/useClientReady";
import type { ChecklistDefinition } from "../../../types/checklist";
import { Checklist } from "./Checklist";

/** Reuses the shared modal shell around any checklist definition. */
export function ChecklistDialog({
  definition,
}: {
  definition: ChecklistDefinition;
}) {
  const [open, onOpenChange] = useState(false);
  const ready = useClientReady();
  const checklist = useChecklist(definition);
  function changeOpen(next: boolean) {
    onOpenChange(next);
    if (!next) checklist.reset();
  }
  return (
    <>
      <Button
        className="checklist-launch"
        disabled={!ready}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
      >
        {definition.dialog.launchLabel} <span aria-hidden="true">↗</span>
      </Button>
      {!ready && <p className="small">{definition.requiresJavaScriptLabel}</p>}
      <Dialog
        state={{ open, onOpenChange: changeOpen }}
        definition={definition.dialog}
        className="checklist-dialog"
        slots={{
          header: <h3>{definition.dialog.heading}</h3>,
          actions: (
            <>
              <IconButton
                label={definition.resetLabel}
                onEscape={() => changeOpen(false)}
                onClick={checklist.reset}
              >
                <WorkspaceIcon name="reset-example" />
              </IconButton>
              <DialogClose asChild>
                <IconButton
                  label={definition.dialog.closeLabel}
                  onEscape={() => changeOpen(false)}
                >
                  <WorkspaceIcon name="close" />
                </IconButton>
              </DialogClose>
            </>
          ),
          footer: <p className="checklist-caption">{definition.caption}</p>,
          body: (
            <Checklist
              key={checklist.resetKey}
              definition={definition}
              state={checklist}
            />
          ),
        }}
      />
    </>
  );
}
