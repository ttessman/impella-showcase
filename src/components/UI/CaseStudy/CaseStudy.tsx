import { DocumentRender } from "../../CMS/renderers/DocumentRender";
import data from "../../../content/impella.json" with { type: "json" };
import { parseDocument, indexDocument } from "../../../utils/document";
export const pageDocument = parseDocument(data);
export const pageIndex = indexDocument(pageDocument);
export function CaseStudy() {
  return <DocumentRender document={pageDocument} />;
}
