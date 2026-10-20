import type { NodeOf } from "../../renderers/ContentViewRender";
import { ReadingHeader } from "../../../UI/ReadingHeader/ReadingHeader";
import { useDocument } from "../../../../hooks/useDocument";

export function ReadingHeaderBundle({
  node,
}: {
  node: NodeOf<"reading_header">;
}) {
  const { page, sections } = useDocument();
  const navigation = page.metadata.navigation;
  return (
    <ReadingHeader
      sections={sections}
      identity={node.content}
      navigation={{
        overview: {
          label: navigation.overview.label,
          href: `#${navigation.overview.target_id}`,
        },
        primaryAction: navigation.primary_action
          ? {
              label: navigation.primary_action.label,
              href: `#${navigation.primary_action.target_id}`,
            }
          : undefined,
        sectionsLabel: navigation.sections_label,
      }}
    />
  );
}
