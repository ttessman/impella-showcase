import type { ReactNode } from "react";
export function Page({
  skipLink,
  slots,
}: {
  skipLink: { href: string; label: string };
  slots: { header: ReactNode; content: ReactNode; footer: ReactNode };
}) {
  return (
    <>
      <a className="skip-link" href={skipLink.href}>
        {skipLink.label}
      </a>
      {slots.header}
      {slots.content}
      {slots.footer}
    </>
  );
}
