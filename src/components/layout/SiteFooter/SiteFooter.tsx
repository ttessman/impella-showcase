import type { ReactNode } from "react";

export function SiteFooter({ slots }: { slots?: { evidence?: ReactNode } }) {
  return (
    <footer>
      {slots?.evidence}
      <div className="footer-summary">
        <div>
          <b>Impella / Architecture as a product decision.</b>
          <p>
            Independent portfolio case study. Product names and imagery belong
            to their respective owners.
            <br />
            Original evidence, descriptive source summaries and educational
            reconstructions are labeled throughout.
          </p>
          <a className="footer-reader-link" href="./case-study.txt">
            Plain-text case study ↗
          </a>
        </div>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
