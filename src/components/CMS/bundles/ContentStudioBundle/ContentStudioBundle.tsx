import type { NodeOf } from "../../renderers/ContentViewRender";
import { StudioIsland } from "../../../UI/ContentStudio/StudioIsland";
import { ContentViewRender } from "../../renderers/ContentViewRender";

export function ContentStudioBundle({
  node,
}: {
  node: NodeOf<"content_studio">;
}) {
  return (
    <StudioIsland fallback={<ContentViewRender blocks={node.content} />} />
  );
}
