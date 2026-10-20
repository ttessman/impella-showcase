import { useMemo } from "react";
import type { PageDocument } from "./ContentViewRender";
import { DocumentContext } from "../../../hooks/useDocument";
import { indexDocument } from "../../../utils/document";
import { BundleRender } from "./BundleRender";

/** Receives an already validated document; all derived state belongs to this document. */
export function DocumentRender({ document }: { document: PageDocument }) {
  const index = useMemo(() => indexDocument(document), [document]);
  return (
    <DocumentContext.Provider value={index}>
      <BundleRender block={document} />
    </DocumentContext.Provider>
  );
}

export type DocumentIndex = ReturnType<typeof indexDocument>;
