import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../support/CmsExample";
import { nodeOf } from "../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Hero",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/bundles/HeroBundle/HeroBundle.tsx",
    docs: {
      description: {
        component:
          "HeroBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("hero"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Split: Story = {
  args: {
    node: {
      ...nodeOf("hero"),
      metadata: { ...nodeOf("hero").metadata, variant: "split" },
    },
  },
};
export const Background: Story = {
  args: {
    node: {
      ...nodeOf("hero"),
      metadata: {
        ...nodeOf("hero").metadata,
        variant: "background",
        background: { src: "/assets/demo/field-notes.svg", position: "center" },
      },
    },
  },
};
