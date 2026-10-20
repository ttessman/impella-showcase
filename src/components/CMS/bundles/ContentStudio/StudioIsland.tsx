import type { ReactNode } from "react";
import { useClientReady } from "../../../../hooks/useClientReady";
import ContentStudio from "../../../../features/ContentStudio/ContentStudio";

/** Keep the narrative readable without JS; mount the unchanged editor after hydration. */
export function StudioIsland({ fallback }: { fallback: ReactNode }) {
  const interactive = useClientReady();
  return interactive ? (
    <ContentStudio />
  ) : (
    <div className="studio-summary">{fallback}</div>
  );
}
