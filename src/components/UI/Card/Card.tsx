import type { ComponentProps, ReactNode } from "react";

type Props = Omit<ComponentProps<"article">, "children"> & {
  variant?: "outlined" | "tinted" | "source-summary";
  headerAttributes?: { "data-bundle-name"?: string };
  footerAttributes?: { "data-bundle-name"?: string };
  slots: {
    header?: ReactNode;
    content: ReactNode;
    footer?: ReactNode;
  };
};

/** Shared card frame; callers supply content while the frame owns its regions. */
export function Card({
  slots,
  headerAttributes,
  footerAttributes,
  variant = "outlined",
  className = "",
  ...props
}: Props) {
  if (variant === "source-summary")
    return (
      <article className={className || undefined} {...props}>
        {slots.header}
        {slots.content}
        {slots.footer}
      </article>
    );
  return (
    <article className={`card card-${variant} ${className}`.trim()} {...props}>
      {slots.header != null && (
        <header {...headerAttributes} className="card-header">
          {slots.header}
        </header>
      )}
      <div className="card-content">{slots.content}</div>
      {slots.footer != null && (
        <footer {...footerAttributes} className="card-footer">
          {slots.footer}
        </footer>
      )}
    </article>
  );
}
