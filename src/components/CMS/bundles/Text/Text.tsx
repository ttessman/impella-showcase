export function Text({
  children,
  mark,
  breakAfter,
}: {
  children: string;
  mark?: "code" | "bold" | "emphasis";
  breakAfter?: boolean;
}) {
  return (
    <>
      {mark === "code" ? (
        <code>{children}</code>
      ) : mark === "bold" ? (
        <b>{children}</b>
      ) : mark === "emphasis" ? (
        <em>{children}</em>
      ) : (
        children
      )}
      {breakAfter && <br />}
    </>
  );
}
