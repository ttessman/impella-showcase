import { useClientReady } from "../../../../hooks/useClientReady";
import ContentStudio from "../../ContentStudio";

/** Keep the narrative readable without JS; mount the unchanged editor after hydration. */
export function StudioIsland() {
  const interactive = useClientReady();
  return interactive ? (
    <ContentStudio />
  ) : (
    <div className="studio-summary">
      <h3>Content studio · independent reconstruction</h3>
      <p>
        This fictional web example demonstrates adding, editing, nesting and
        reordering content blocks, inspecting JSON and previewing a mobile page.
        It is independently written portfolio code, separate from the original
        React Native application and clinical tools.
      </p>
      <p>
        The interactive editor requires JavaScript. The original architecture,
        ownership and production evidence remain readable below.
      </p>
      <a href="#contract">Explore the original rendering architecture ↓</a>
    </div>
  );
}
