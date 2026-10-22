import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "../../../src/components/UI/Footer/Footer";
const meta = {
  title: "UI/Footer",
  component: Footer,
  parameters: { componentPath: "src/components/UI/Footer/Footer.tsx" },
  args: {
    variant: "site",
    children: "A fictional creative journal",
    componentLibrary: {
      enabled: true,
      label: "Component library",
      href: "./storybook/",
    },
  },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
