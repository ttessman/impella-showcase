import { renderToStaticMarkup } from "react-dom/server";
import { DocumentRender } from "../../src/components/CMS/renderers/DocumentRender";
import { TooltipProvider } from "../../src/components/UI/Tooltip/TooltipProvider";
import { parseDocument } from "../../src/utils/document";
export function renderDocument(data: unknown) {
  return renderToStaticMarkup(
    <TooltipProvider>
      <DocumentRender document={parseDocument(data)} />
    </TooltipProvider>,
  );
}
