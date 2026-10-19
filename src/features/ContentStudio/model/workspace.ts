export type WorkspaceLayout = {
  collapsed: boolean;
  layout: "side" | "stacked";
  composeWidth: number;
  inspectWidth: number;
  previewHeight: number;
};
export const initialWorkspaceLayout: WorkspaceLayout = {
  collapsed: false,
  layout: "stacked",
  composeWidth: 34,
  inspectWidth: 50,
  previewHeight: 48,
};
