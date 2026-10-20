import type { NodeOf } from "../../../../types/cms";
import { StudioIsland } from "../../../../features/ContentStudio/components/StudioIsland/StudioIsland";
import { ContentView } from "../../ContentView/ContentView";

export function ContentStudio({ node }: { node: NodeOf<"content_studio"> }) {
  return <StudioIsland fallback={<ContentView blocks={node.content} />} />;
}
