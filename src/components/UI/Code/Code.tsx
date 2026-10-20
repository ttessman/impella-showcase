export function Code({
  "data-bundle-name": bundleName,
  inline,
  children,
}: {
  "data-bundle-name"?: string;
  inline?: boolean;
  children: string;
}) {
  return inline ? (
    <code data-bundle-name={bundleName}>{children}</code>
  ) : (
    <pre data-bundle-name={bundleName}>
      <code data-bundle-name={bundleName}>{children}</code>
    </pre>
  );
}
