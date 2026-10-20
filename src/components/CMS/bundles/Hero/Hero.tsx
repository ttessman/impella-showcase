import type { ReactNode } from "react";
export function Hero({
  id,
  slots,
}: {
  id?: string;
  slots: { header: ReactNode; content: ReactNode; footer: ReactNode };
}) {
  return (
    <div className="hero-band">
      <div id={id} className="hero">
        <div className="hero-copy">{slots.header}</div>
        {slots.content}
      </div>
      {slots.footer}
    </div>
  );
}
