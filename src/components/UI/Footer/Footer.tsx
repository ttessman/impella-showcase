import { Group } from "../Layout/Group";
import { Icon } from "../Icon/Icon";
import type { ReactNode } from "react";

type BundleAttributes = { id?: string; "data-bundle-name"?: string };

export function Footer({
  "data-bundle-name": bundleName,
  id,
  variant,
  children,
  componentLibrary,
  summary,
  summaryActions,
  summaryAside,
  summaryAttributes,
  summaryContentAttributes,
}: {
  "data-bundle-name"?: string;
  id?: string;
  variant?: "site";
  children: ReactNode;
  componentLibrary?: { enabled: boolean; label: string; href: string };
  summary?: ReactNode;
  summaryActions?: ReactNode;
  summaryAside?: ReactNode;
  summaryAttributes?: BundleAttributes;
  summaryContentAttributes?: BundleAttributes;
}) {
  return (
    <footer
      data-bundle-name={bundleName}
      id={id}
      className={variant === "site" ? "site-footer" : undefined}
    >
      {(summary != null || componentLibrary?.enabled) && (
        <Group {...summaryAttributes} variant="footer-summary">
          <div {...summaryContentAttributes}>
            {summary}
            <div className="footer-actions">
              {summaryActions}
              {componentLibrary?.enabled && (
                <a
                  className="component-library-link"
                  href={componentLibrary.href}
                >
                  {componentLibrary.label} <Icon type="external" size={12} />
                </a>
              )}
            </div>
          </div>
          {summaryAside}
        </Group>
      )}
      {children}
    </footer>
  );
}
