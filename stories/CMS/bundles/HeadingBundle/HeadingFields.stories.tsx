import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { HeadingFields } from "../../../../src/components/CMS/bundles/HeadingBundle/HeadingFields";
import { parsePage } from "../../../../src/utils/studio";
import sample from "../../../../src/content/studio.json";
const initial = parsePage(JSON.stringify(sample)).content.find(
  (node) => node.bundle === "heading",
)!;
function Example() {
  const [block, setBlock] = useState(initial);
  return block.bundle === "heading" ? (
    <div className="author-pane">
      <HeadingFields block={block} onChange={setBlock} />
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  ) : null;
}
const meta = {
  title: "CMS/Bundles/Heading/Fields",
  parameters: {
    componentPath: "src/components/CMS/bundles/HeadingBundle/HeadingFields.tsx",
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
export const Default: StoryObj<typeof meta> = {};
