import type { ReactNode } from "react";
import { Button } from "../Button/Button";
export function Action({
  href,
  variant,
  newTab,
  children,
}: {
  href: string;
  variant?: "text" | "primary" | "reader";
  newTab?: boolean;
  children: ReactNode;
}) {
  return (
    <Button asChild size={variant === "primary" ? "large" : "default"}>
      <a
        href={href}
        className={variant === "primary" ? "button primary" : "text-link"}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noreferrer" : undefined}
      >
        {children}
      </a>
    </Button>
  );
}
