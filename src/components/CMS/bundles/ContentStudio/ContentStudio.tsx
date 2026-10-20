import type { NodeOf } from "../../../../types/cms";
import { StudioIsland } from "./StudioIsland";
import { ContentView } from "../../renderers/ContentView";

export function ContentStudio({ node }: { node: NodeOf<"content_studio"> }) {
  return <StudioIsland fallback={<ContentView blocks={node.content} />} />;
}
