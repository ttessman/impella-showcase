import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmsExample } from "../../support/CmsExample";
import { nodeOf } from "../../support/fixtures";
const meta = {
  title: "CMS/Renderers/FrameContentRender",
  component: CmsExample,
  parameters: {
    componentPath: "src/components/CMS/renderers/FrameContentRender.tsx",
    docs: {
      description: {
        component:
          "FrameContentRender: the real CMS renderer with editable, validated JSON and document context. Open Edit example JSON in the canvas, or use the node control.",
      },
    },
  },
  args: { node: nodeOf("header"), renderer: "FrameContentRender" },
  render: (args) => <CmsExample key={JSON.stringify(args)} {...args} />,
} satisfies Meta<typeof CmsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
