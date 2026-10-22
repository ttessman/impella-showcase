import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../../support/CmsExample";
import { nodeOf } from "../../../support/fixtures";
const meta = {
  title: "CMS/Bundles/Footer",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/bundles/FooterBundle/FooterBundle.tsx",
    docs: {
      description: {
        component:
          "FooterBundle: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("footer"), renderer: "BundleRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
