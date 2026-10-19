import { useEffect, useRef, useState } from "react";

/** Scroll direction controls presentation; links remain reachable by keyboard. */
export function SiteHeader() {
  const root = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    let anchor = window.scrollY;
    let frame = 0;
    function update() {
      frame = 0;
      const y = Math.max(
        0,
        Math.min(
          window.scrollY,
          document.documentElement.scrollHeight - innerHeight,
        ),
      );
      const height = root.current?.offsetHeight ?? 100;
      setFloating(y > 20);
      if (y <= height) {
        setHidden(false);
        anchor = y;
      } else if (Math.abs(y - anchor) >= 10) {
        setHidden(
          y > anchor && !root.current?.contains(document.activeElement),
        );
        anchor = y;
      }
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <header
      ref={root}
      className="site-header-shell"
      data-hidden={hidden}
      data-floating={floating}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="site-header">
        <a href="#top" className="wordmark">
          TYLER TESSMANN<span>Design engineering / Selected work</span>
        </a>
        <nav aria-label="Case study">
          <a href="#architecture">Architecture</a>
          <a href="#product">Product</a>
          <a className="nav-demo" href="#playground">
            Content studio <span aria-hidden="true">↓</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
