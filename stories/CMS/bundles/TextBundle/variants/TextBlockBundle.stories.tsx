import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../../support/CmsExample";
import { nodeOf } from "../../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Text/BlockText",
  component: CmsExample,
  parameters: {
    componentPath:
      "src/components/CMS/bundles/TextBundle/variants/TextBlockBundle.tsx",
    docs: {
      description: {
        component:
          "TextBlockBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("text_block"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
