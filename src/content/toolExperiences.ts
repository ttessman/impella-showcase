import { screenshots } from "./evidence";
import { caseStudyCopy } from "./caseStudy";
import { sourceExamples } from "./sourceExamples";

function screenshot(file: string, title: string) {
  const shot = screenshots.find((item) => item.file === file);
  if (!shot) throw Error(`Missing tool evidence: ${file}`);
  return {
    title,
    image: {
      src: `${import.meta.env.BASE_URL}assets/production/${file}`,
      alt: shot.alt,
      width: 460,
      height: 996,
    },
    caption: "Apple listing · Capture date unverified",
  };
}
export const toolExperiences = [
  {
    kind: "calculator",
    title: caseStudyCopy.tools.calculatorTitle,
    body: `${caseStudyCopy.tools.calculators} ${caseStudyCopy.tools.clinicalBoundary}`,
    evidence: screenshot("apple-aki.webp", "AKI calculator input"),
    source: sourceExamples.calculators,
    disclosure: "How the calculator works",
  },
  {
    kind: "checklist",
    title: caseStudyCopy.tools.checklistTitle,
    body: caseStudyCopy.tools.checklists,
    evidence: screenshot("apple-checklist.webp", "Checklist selection example"),
    source: sourceExamples.checklists,
    disclosure: "How the checklist works",
  },
] as const;
