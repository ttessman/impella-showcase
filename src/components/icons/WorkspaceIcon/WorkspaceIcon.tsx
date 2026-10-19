export type WorkspaceIconName =
  | "compose"
  | "close"
  | "collapse"
  | "expand"
  | "columns"
  | "rows"
  | "reset-layout"
  | "reset-example";
export function WorkspaceIcon({ name }: { name: WorkspaceIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "close" ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : name === "compose" ? (
        <>
          <path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z" />
          <path d="m5 15 4 4" />
        </>
      ) : name === "reset-example" ? (
        <>
          <path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          {(name === "collapse" || name === "expand") && (
            <>
              <path d="M9 4v16" />
              <path
                d={name === "collapse" ? "m16 9-3 3 3 3" : "m13 9 3 3-3 3"}
              />
            </>
          )}
          {name === "columns" && <path d="M12 4v16" />}
          {name === "rows" && <path d="M3 12h18" />}
          {name === "reset-layout" && (
            <>
              <path d="M9 4v16m0-8h12" />
              <path d="m14 8 2-2 2 2" />
            </>
          )}
        </>
      )}
    </svg>
  );
}
