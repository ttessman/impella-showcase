import type { ComponentProps, ReactNode } from "react";

type Props = Omit<ComponentProps<"article">, "children"> & {
  variant?: "outlined" | "tinted" | "source-summary";
  slots: {
    header?: ReactNode;
    content: ReactNode;
    footer?: ReactNode;
  };
};

/** Shared card frame; callers supply content while the frame owns its regions. */
export function Card({
  slots,
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
        <header className="card-header">{slots.header}</header>
      )}
      <div className="card-content">{slots.content}</div>
      {slots.footer != null && (
        <footer className="card-footer">{slots.footer}</footer>
      )}
    </article>
  );
}
