import data from "./pages/impella.json" with { type: "json" };
import { parseDocument } from "../components/CMS/model/validateDocument";
import { indexDocument } from "../components/CMS/model/document";
export const pageDocument = parseDocument(data);
export const pageIndex = indexDocument(pageDocument);
