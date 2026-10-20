export function EditorFeedback({
  error,
  message,
}: {
  error: string;
  message: string;
}) {
  return (
    <>
      {error && (
        <p className="validation-error" role="alert">
          {error}
        </p>
      )}
      <p className="builder-status" role="status">
        {message}
      </p>
    </>
  );
}
