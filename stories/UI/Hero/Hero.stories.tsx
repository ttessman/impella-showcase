import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hero } from "../../../src/components/UI/Hero/Hero";
import { image } from "../../support/fixtures";
const meta = {
  title: "UI/Hero",
  component: Hero,
  parameters: { componentPath: "src/components/UI/Hero/Hero.tsx" },
  args: {
    variant: "split",
    header: {
      eyebrow: "Fictional journal",
      title: "Make room for *noticing*.",
      tags: ["Creative", "Independent"],
    },
    areas: {
      content: <p>Make a small observation today.</p>,
      aside: <img {...image} style={{ maxWidth: "100%" }} />,
      actions: <a href="#notes">Explore the notes</a>,
      footer: <p>A fictional component example.</p>,
    },
  },
} satisfies Meta<typeof Hero>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Background: Story = {
  args: { variant: "background", background: { src: image.src } },
};
