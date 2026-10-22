import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TextBlockFields } from "../../../../../src/components/CMS/bundles/TextBundle/variants/TextBlockFields";
import { parsePage } from "../../../../../src/utils/studio";
import sample from "../../../../../src/content/studio.json";
const initial = parsePage(JSON.stringify(sample)).content.find(
  (node) => node.bundle === "text_block",
)!;
function Example() {
  const [block, setBlock] = useState(initial);
  return block.bundle === "text_block" ? (
    <div className="author-pane">
      <TextBlockFields block={block} onChange={setBlock} />
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  ) : null;
}
const meta = {
  title: "CMS/Bundles/Text/BlockText/Fields",
  parameters: {
    componentPath:
      "src/components/CMS/bundles/TextBundle/variants/TextBlockFields.tsx",
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
export const Default: StoryObj<typeof meta> = {};
