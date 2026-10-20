import type { ReactNode } from "react";
import type { StudioLayout } from "../../../hooks/useWorkspaceLayout";
import { StudioWorkspace } from "./StudioWorkspace";

export type ContentStudioSlots = {
  toolbar: ReactNode;
  compose: ReactNode;
  inspect: ReactNode;
  preview: ReactNode;
  feedback: ReactNode;
};
/** Placement belongs to the layout; callers supply the named content regions. */
export function ContentStudioLayout({
  slots,
  layout,
}: {
  slots: ContentStudioSlots;
  layout: StudioLayout;
}) {
  return (
    <div className="playground">
      {slots.toolbar}
      <StudioWorkspace layout={layout} slots={slots} />
      <footer className="studio-footer" aria-hidden="true" />
    </div>
  );
}
