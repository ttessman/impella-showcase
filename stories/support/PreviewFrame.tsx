import { useEffect } from "react";
import type { ReactNode } from "react";
import { TooltipProvider } from "../../src/components/UI/Tooltip/TooltipProvider";
export function PreviewFrame({
  theme,
  children,
}: {
  theme: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <TooltipProvider delayDuration={250}>
      <div
        data-story-canvas
        style={{
          padding: "var(--space-6)",
          minHeight: "100vh",
          color: "var(--text)",
          background: "var(--page)",
        }}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}
