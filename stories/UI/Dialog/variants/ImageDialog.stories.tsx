import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { ImageDialog } from "../../../../src/components/UI/Dialog/variants/ImageDialog";
import { image } from "../../../support/fixtures";
type ExampleArgs = Omit<ComponentProps<typeof ImageDialog>, "state">;
function Example(args: ExampleArgs) {
  const [open, onOpenChange] = useState(false);
  return (
    <>
      <button
        className="button button-secondary"
        onClick={() => onOpenChange(true)}
      >
        View illustration
      </button>
      <ImageDialog {...args} state={{ open, onOpenChange }} />
    </>
  );
}
const meta = {
  title: "UI/Dialog/ImageDialog",
  component: Example,
  parameters: {
    componentPath: "src/components/UI/Dialog/variants/ImageDialog.tsx",
  },
  args: {
    image,
    title: "Field journal",
    size: "small",
    closeLabel: "Close illustration",
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: "small" } };
export const Large: Story = { args: { size: "large" } };
