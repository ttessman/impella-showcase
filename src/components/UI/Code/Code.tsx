export function Code({
  inline,
  children,
}: {
  inline?: boolean;
  children: string;
}) {
  return inline ? (
    <code>{children}</code>
  ) : (
    <pre>
      <code>{children}</code>
    </pre>
  );
}
