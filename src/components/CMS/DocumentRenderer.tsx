import { useMemo } from "react";
import type { PageDocument } from "../../types/cms";
import { DocumentContext } from "./model/DocumentContext";
import { indexDocument } from "./model/document";
import { BundleRender } from "./BundleRender/BundleRender";

/** Receives an already validated document; all derived state belongs to this document. */
export function DocumentRenderer({ document }: { document: PageDocument }) {
  const index = useMemo(() => indexDocument(document), [document]);
  return (
    <DocumentContext.Provider value={index}>
      <BundleRender block={document} />
    </DocumentContext.Provider>
  );
}
