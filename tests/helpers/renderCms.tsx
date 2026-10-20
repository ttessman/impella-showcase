import { renderToStaticMarkup } from "react-dom/server";
import { DocumentRenderer } from "../../src/components/CMS/renderers/DocumentRenderer";
import { TooltipProvider } from "../../src/components/overlays/Tooltip/TooltipProvider";
import { parseDocument } from "../../src/components/CMS/model/validateDocument";
export function renderDocument(data: unknown) {
  return renderToStaticMarkup(
    <TooltipProvider>
      <DocumentRenderer document={parseDocument(data)} />
    </TooltipProvider>,
  );
}
