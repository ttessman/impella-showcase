import { DocumentRenderer } from "../../components/CMS/renderers/DocumentRenderer";
import { pageDocument } from "../../content/pageDocument";
export function CaseStudyPage() {
  return <DocumentRenderer document={pageDocument} />;
}
