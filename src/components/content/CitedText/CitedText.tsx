import { Fragment } from "react";

/** Recognize only numeric superscripts; all other authored markup stays escaped text. */
export function CitedText({ text }: { text: string }) {
  const citations = /<sup>([1-9]\d{0,2}(?:\s*,\s*[1-9]\d{0,2})*)<\/sup>/g;
  const parts = [];
  let cursor = 0;
  for (const match of text.matchAll(citations)) {
    parts.push(
      <Fragment key={`text-${cursor}`}>
        {text.slice(cursor, match.index)}
      </Fragment>,
    );
    const numbers = match[1].split(",").map((number) => number.trim());
    parts.push(
      <sup key={`citation-${match.index}`}>
        <span className="sr-only">
          {numbers.length === 1 ? "Reference " : "References "}
        </span>
        {numbers.join(",")}
      </sup>,
    );
    cursor = match.index + match[0].length;
  }
  parts.push(<Fragment key={`text-${cursor}`}>{text.slice(cursor)}</Fragment>);
  return <>{parts}</>;
}
