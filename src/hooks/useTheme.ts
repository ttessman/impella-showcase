import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/** System preference until an explicit choice; storage is optional. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function sync() {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("site-theme");
      } catch {
        /* Storage may be blocked. */
      }
      const next =
        saved === "light" || saved === "dark"
          ? saved
          : media.matches
            ? "dark"
            : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    }
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("site-theme", next);
    } catch {
      /* The current tab still changes. */
    }
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }
  return { theme, toggle };
}
