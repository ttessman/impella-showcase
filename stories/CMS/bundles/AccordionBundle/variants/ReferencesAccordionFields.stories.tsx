import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ReferencesAccordionFields } from "../../../../../src/components/CMS/bundles/AccordionBundle/variants/ReferencesAccordionFields";
import { parsePage } from "../../../../../src/utils/studio";
import sample from "../../../../../src/content/studio.json";
const initial = parsePage(JSON.stringify(sample)).content.find(
  (node) => node.bundle === "references_accordion",
)!;
function Example() {
  const [block, setBlock] = useState(initial);
  return block.bundle === "references_accordion" ? (
    <div className="author-pane">
      <ReferencesAccordionFields block={block} onChange={setBlock} />
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </div>
  ) : null;
}
const meta = {
  title: "CMS/Bundles/Accordion/ReferencesAccordion/Fields",
  parameters: {
    componentPath:
      "src/components/CMS/bundles/AccordionBundle/variants/ReferencesAccordionFields.tsx",
  },
  render: () => <Example />,
} satisfies Meta;
export default meta;
export const Default: StoryObj<typeof meta> = {};
