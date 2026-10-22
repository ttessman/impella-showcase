import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Dialog, DialogClose } from "../../../src/components/UI/Dialog/Dialog";
import { IconButton } from "../../../src/components/UI/Button/variants/IconButton";
import { Icon } from "../../../src/components/UI/Icon/Icon";
type ExampleArgs = Omit<ComponentProps<typeof Dialog>, "state">;
function Example(args: ExampleArgs) {
  const [open, onOpenChange] = useState(false);
  return (
    <>
      <button
        className="button button-secondary"
        onClick={() => onOpenChange(true)}
      >
        Open dialog
      </button>
      <Dialog
        {...args}
        state={{ open, onOpenChange }}
        slots={{
          ...args.slots,
          actions: (
            <DialogClose asChild>
              <IconButton label="Close dialog">
                <Icon type="close" />
              </IconButton>
            </DialogClose>
          ),
        }}
      />
    </>
  );
}
const meta = {
  title: "UI/Dialog",
  component: Example,
  parameters: { componentPath: "src/components/UI/Dialog/Dialog.tsx" },
  args: {
    size: "default",
    definition: {
      title: "A compact dialog",
      description: "An interactive component example.",
    },
    slots: {
      body: (
        <p>
          Escape, the close button, and clicking outside dismiss the dialog.
        </p>
      ),
      footer: <p className="small">Optional footer.</p>,
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Small: Story = { args: { size: "small" } };
export const Large: Story = { args: { size: "large" } };
