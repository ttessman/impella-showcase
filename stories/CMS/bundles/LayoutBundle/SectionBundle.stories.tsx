import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../support/CmsExample";
import { nodeOf } from "../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Layout/Section",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/bundles/LayoutBundle/SectionBundle.tsx",
    docs: {
      description: {
        component:
          "SectionBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("section"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Preview: Story = {
  args: {
    node: {
      ...nodeOf("section"),
      metadata: { ...nodeOf("section").metadata, variant: "preview" },
    },
  },
};
export const Paper: Story = {
  args: {
    node: {
      ...nodeOf("section"),
      metadata: { ...nodeOf("section").metadata, variant: "paper" },
    },
  },
};
export const FullBleed: Story = {
  args: {
    node: {
      ...nodeOf("section"),
      metadata: { ...nodeOf("section").metadata, variant: "full-bleed" },
    },
  },
};
