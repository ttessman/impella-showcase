import { createContext, useContext } from "react";
import type { DocumentIndex } from "./document";
export const DocumentContext = createContext<DocumentIndex | null>(null);
export function useDocument() {
  const value = useContext(DocumentContext);
  if (!value) throw Error("This bundle requires a page document");
  return value;
}
