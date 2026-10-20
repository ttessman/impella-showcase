import type { ReactNode } from "react";
export function Page({
  "data-bundle-name": bundleName,
  skipLink,
  slots,
}: {
  "data-bundle-name"?: string;
  skipLink: { href: string; label: string };
  slots: { header: ReactNode; content: ReactNode; footer: ReactNode };
}) {
  return (
    <div data-bundle-name={bundleName}>
      <a className="skip-link" href={skipLink.href}>
        {skipLink.label}
      </a>
      {slots.header}
      {slots.content}
      {slots.footer}
    </div>
  );
}
