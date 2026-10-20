export function Text({
  "data-bundle-name": bundleName,
  children,
  mark,
  breakAfter,
}: {
  "data-bundle-name"?: string;
  children: string;
  mark?: "code" | "bold" | "emphasis";
  breakAfter?: boolean;
}) {
  return (
    <>
      {mark === "code" ? (
        <code data-bundle-name={bundleName}>{children}</code>
      ) : mark === "bold" ? (
        <b data-bundle-name={bundleName}>{children}</b>
      ) : mark === "emphasis" ? (
        <em data-bundle-name={bundleName}>{children}</em>
      ) : bundleName ? (
        <span data-bundle-name={bundleName}>{children}</span>
      ) : (
        children
      )}
      {breakAfter && <br />}
    </>
  );
}
