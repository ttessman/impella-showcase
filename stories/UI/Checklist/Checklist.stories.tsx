import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { useChecklist } from "../../../src/hooks/useChecklist";
import { Checklist } from "../../../src/components/UI/Checklist/Checklist";
import { checklist } from "../../support/fixtures";
type ExampleArgs = Omit<ComponentProps<typeof Checklist>, "state">;
function Example(args: ExampleArgs) {
  const state = useChecklist(checklist);
  return <Checklist {...args} state={state} />;
}
const meta = {
  title: "UI/Checklist",
  component: Example,
  parameters: { componentPath: "src/components/UI/Checklist/Checklist.tsx" },
  args: { definition: checklist },
  render: (args) => <Example {...args} />,
} satisfies Meta<ExampleArgs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
