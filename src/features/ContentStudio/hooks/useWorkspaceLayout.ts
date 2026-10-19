import { useEffect, useState } from "react";
import { initialWorkspaceLayout } from "../model/workspace";
import type { WorkspaceLayout } from "../model/workspace";

/** Layout changes cancel transient drags while preserving content and JSON drafts. */
export function useWorkspaceLayout(interaction: {
  active: boolean;
  cancel: () => void;
}) {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 650px)").matches,
  );
  const [composeOpen, setComposeOpen] = useState(false);
  const [value, setValue] = useState(initialWorkspaceLayout);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 650px)");
    const update = () => {
      setMobile(media.matches);
      setComposeOpen(false);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return {
    mobile,
    composeOpen,
    value,
    escapeCompose(event: KeyboardEvent) {
      if (interaction.active) {
        event.preventDefault();
        interaction.cancel();
      }
    },
    openCompose() {
      interaction.cancel();
      setComposeOpen(true);
    },
    closeCompose() {
      interaction.cancel();
      setComposeOpen(false);
    },
    reset() {
      interaction.cancel();
      setValue(initialWorkspaceLayout);
    },
    change(patch: Partial<WorkspaceLayout>) {
      interaction.cancel();
      setValue((current) => ({ ...current, ...patch }));
    },
  };
}
export type StudioLayout = ReturnType<typeof useWorkspaceLayout>;
