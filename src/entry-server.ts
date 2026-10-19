import { createElement, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./app/App";
export {
  buildMetadata,
  buildReaderText,
  resolveSiteUrl,
} from "./features/CaseStudy/metadata/buildMetadata";

export function renderPage() {
  return renderToString(createElement(StrictMode, null, createElement(App)));
}
