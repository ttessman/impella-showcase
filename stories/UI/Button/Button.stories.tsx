import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../src/components/UI/Button/Button";
const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { componentPath: "src/components/UI/Button/Button.tsx" },
  args: { variant: "secondary", children: "Continue", size: "default" },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: "small" } };
export const Large: Story = { args: { size: "large" } };
export const Disabled: Story = { args: { disabled: true } };

export const Primary: Story = { args: { variant: "primary" } };
export const Text: Story = { args: { variant: "text" } };
export const Navigation: Story = {
  args: {
    href: "#overview",
    variant: "primary",
    size: "large",
    children: "Explore the journal",
  },
};
export const ExternalNavigation: Story = {
  args: {
    href: "https://example.com",
    target: "_blank",
    rel: "noreferrer",
    variant: "text",
    children: "Visit example site",
  },
};
