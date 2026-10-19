export type WorkspaceIconName =
  "collapse" | "expand" | "columns" | "rows" | "reset-layout" | "reset-example";
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
      {name === "reset-example" ? (
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
