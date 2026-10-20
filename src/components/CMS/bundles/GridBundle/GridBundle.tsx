import type { NodeOf } from "../../renderers/ContentViewRender";
import { Grid } from "../../../UI/Layout/Grid";
import { ContentViewRender } from "../../renderers/ContentViewRender";
export function GridBundle({ node }: { node: NodeOf<"grid"> }) {
  return (
    <Grid id={node.id} variant={node.metadata.variant}>
      <ContentViewRender blocks={node.content} />
    </Grid>
  );
}
