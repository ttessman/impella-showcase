import type { NodeOf } from "../../../../types/cms";

export function Text({ node }: { node: NodeOf<"text"> }) {
  const copy = node.content;
  const mark = node.metadata.mark;
  return (
    <>
      {mark === "code" ? (
        <code>{copy}</code>
      ) : mark === "bold" ? (
        <b>{copy}</b>
      ) : mark === "emphasis" ? (
        <em>{copy}</em>
      ) : (
        copy
      )}
      {node.metadata.break_after && <br />}
    </>
  );
}
