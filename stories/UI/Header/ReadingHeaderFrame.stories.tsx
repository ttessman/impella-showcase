import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useRef } from "react";
import { ReadingHeaderFrame } from "../../../src/components/UI/Header/ReadingHeaderFrame";
type ExampleArgs = Omit<ComponentProps<typeof ReadingHeaderFrame>, "ref">;
function Example(args: ExampleArgs) {
  const ref = useRef<HTMLElement>(null);
  return <ReadingHeaderFrame {...args} ref={ref} />;
}
const meta = {
  title: "UI/Header/ReadingHeader/Frame",
  component: Example,
  parameters: {
    componentPath: "src/components/UI/Header/ReadingHeaderFrame.tsx",
  },
  args: {
    expanded: false,
    progress: 0.4,
    slots: {
      identity: <a href="#overview">FIELD NOTES</a>,
      context: <span>01 / A field journal</span>,
      actions: <button>Sections</button>,
    },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
