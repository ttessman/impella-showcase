import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "../../Button/Button";
import { IconButton } from "../../Button/variants/IconButton";
import { Icon } from "../../Icon/Icon";
import { useChecklist } from "../../../../hooks/useChecklist";
import { Dialog } from "../Dialog";
import { DialogClose } from "../DialogClose";
import { useClientReady } from "../../../../hooks/useClientReady";
import type { ChecklistDefinition } from "../../Checklist/Checklist";
import { Checklist } from "../../Checklist/Checklist";

/** Reuses the shared modal shell around any checklist definition. */
export function ChecklistDialog({
  definition,
  renderOutcome,
}: {
  definition: ChecklistDefinition;
  renderOutcome?: (id: string | null) => ReactNode;
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
        variant="secondary"
        size="default"
        className="checklist-launch"
        disabled={!ready}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => onOpenChange(true)}
      >
        {definition.dialog.launchLabel} <Icon type="external" />
      </Button>
      {!ready && <p className="small">{definition.requiresJavaScriptLabel}</p>}
      <Dialog
        size="large"
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
                <Icon type="reset-example" />
              </IconButton>
              <DialogClose asChild>
                <IconButton
                  label={definition.dialog.closeLabel}
                  onEscape={() => changeOpen(false)}
                >
                  <Icon type="close" />
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
              renderOutcome={renderOutcome}
            />
          ),
        }}
      />
    </>
  );
}
