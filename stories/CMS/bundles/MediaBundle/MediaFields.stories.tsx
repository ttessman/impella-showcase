import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MediaFields } from "../../../../src/components/CMS/bundles/MediaBundle/MediaFields";
import { parsePage } from "../../../../src/utils/studio";
import sample from "../../../../src/content/studio.json";
const initial = parsePage(JSON.stringify(sample)).content.find(
  (node) => node.bundle === "media",
)!;
function Example() {
  const [block, setBlock] = useState(initial);
  return block.bundle === "media" ? (
    <div className="author-pane">
      <MediaFields block={block} onChange={setBlock} />
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  ) : null;
}
const meta = {
  title: "CMS/Bundles/Media/Fields",
  parameters: {
    componentPath: "src/components/CMS/bundles/MediaBundle/MediaFields.tsx",
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
export const Default: StoryObj<typeof meta> = {};
