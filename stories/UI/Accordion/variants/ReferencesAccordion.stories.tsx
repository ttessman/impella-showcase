import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReferencesAccordion } from "../../../../src/components/UI/Accordion/variants/ReferencesAccordion";
const meta = {
  title: "UI/Accordion/ReferencesAccordion",
  component: ReferencesAccordion,
  parameters: {
    componentPath:
      "src/components/UI/Accordion/variants/ReferencesAccordion.tsx",
  },
  args: {
    label: "Reading notes",
    items: [
      { id: "one", content: "Fictional journal, volume one." },
      { id: "two", content: "Fictional studio notes, edition two." },
    ],
  },
} satisfies Meta<typeof ReferencesAccordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
