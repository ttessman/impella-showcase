import type { NodeOf } from "../../../../types/cms";
import { ReadingNavigation as ReadingNavigationView } from "../../../layout/ReadingHeader/ReadingNavigation";
import { useDocument } from "../../model/DocumentContext";

export function ReadingHeader({ node }: { node: NodeOf<"reading_header"> }) {
  const { page, sections } = useDocument();
  return (
    <ReadingNavigationView
      sections={sections}
      identity={node.content}
      navigation={page.metadata.navigation}
    />
  );
}
