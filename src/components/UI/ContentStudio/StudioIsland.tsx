import type { ReactNode } from "react";
import { useClientReady } from "../../../hooks/useClientReady";
import ContentStudio from "./ContentStudio";

/** Keep the narrative readable without JS; mount the unchanged editor after hydration. */
export function StudioIsland({
  fallback,
  "data-bundle-name": bundleName,
}: {
  fallback: ReactNode;
  "data-bundle-name"?: string;
}) {
  const interactive = useClientReady();
  return interactive ? (
    <ContentStudio data-bundle-name={bundleName} />
  ) : (
    <div data-bundle-name={bundleName} className="studio-summary">
      {fallback}
    </div>
  );
}
