import type { NodeOf } from "../../../../types/cms";
import { Grid } from "./Grid";
import { ContentView } from "../../renderers/ContentView";
export function GridBundle({ node }: { node: NodeOf<"grid"> }) {
  return (
    <Grid id={node.id} variant={node.metadata.variant}>
      <ContentView blocks={node.content} />
    </Grid>
  );
}
