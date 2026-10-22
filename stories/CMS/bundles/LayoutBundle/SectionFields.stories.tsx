import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SectionFields } from "../../../../src/components/CMS/bundles/LayoutBundle/SectionFields";
import { parsePage } from "../../../../src/utils/studio";
import sample from "../../../../src/content/studio.json";
const initial = parsePage(JSON.stringify(sample)).content.find(
  (node) => node.bundle === "section",
)!;
function Example() {
  const [block, setBlock] = useState(initial);
  return block.bundle === "section" ? (
    <div className="author-pane">
      <SectionFields block={block} onChange={setBlock} />
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  ) : null;
}
const meta = {
  title: "CMS/Bundles/Layout/Section/Fields",
  parameters: {
    componentPath: "src/components/CMS/bundles/LayoutBundle/SectionFields.tsx",
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
export const Default: StoryObj<typeof meta> = {};
