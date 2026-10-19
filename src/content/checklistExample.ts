import type { ChecklistDefinition } from "../types/checklist";

/** Fictional creative prompts demonstrate authored rules without reproducing clinical content. */
export const checklistExample = {
  title: "Pack a tiny adventure.",
  description:
    "A fictional checklist. Choose your kit, then see which creative prompt it unlocks.",
  groups: [
    {
      id: "kit",
      title: "What’s coming with you?",
      options: [
        { id: "notebook", label: "A trusty notebook" },
        { id: "pencil", label: "A pencil with big plans" },
        { id: "camera", label: "A camera for tiny discoveries" },
      ],
    },
  ],
  rules: [
    {
      operator: "and",
      required: ["notebook", "pencil"],
      outcome: {
        id: "sketch",
        title: "Sketch something ordinary.",
        body: "Give a familiar object five minutes of your attention. Its wonky corners count as character.",
        explanation: "Both notebook and pencil selected · AND rule",
      },
    },
    {
      operator: "or",
      required: ["camera"],
      outcome: {
        id: "color",
        title: "Hunt for a color.",
        body: "Find three different things in the same shade. A tiny collection, entirely yours.",
        explanation: "Camera selected · OR rule",
      },
    },
    {
      operator: "or",
      required: ["notebook", "pencil"],
      outcome: {
        id: "notice",
        title: "Catch one tiny detail.",
        body: "Save a shape, a sound or a stray idea. It doesn’t have to become anything yet.",
        explanation: "At least one drawing tool selected · OR rule",
      },
    },
  ],
  fallback: {
    id: "curiosity",
    title: "Bring your curiosity.",
    body: "No kit required. Notice something you’ve walked past a hundred times before.",
    explanation: "No matching kit rule · fallback prompt",
  },
  submitLabel: "Find my mini adventure",
  emptyTitle: "A small adventure awaits.",
  emptyBody: "Your choices pick a prompt. Submit to see where they take you.",
} as const satisfies ChecklistDefinition;
