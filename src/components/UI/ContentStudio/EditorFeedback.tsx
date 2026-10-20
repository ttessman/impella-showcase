export function EditorFeedback({
  error,
  message,
  tone = "neutral",
}: {
  error: string;
  message: string;
  tone?: "neutral" | "success";
}) {
  return (
    <div className="editor-feedback" data-tone={error ? "error" : tone}>
      <p
        className="editor-feedback-message"
        role={error ? "alert" : "status"}
        title={error || message}
      >
        {error || message}
      </p>
    </div>
  );
}
