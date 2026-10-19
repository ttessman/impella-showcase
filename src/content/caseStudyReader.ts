import { caseStudySections } from "./caseStudy";
import { siteIdentity } from "./siteIdentity";

/** The reading summary shares the published editorial content and attribution. */
export const caseStudyReader = {
  title: "Impella / Architecture as a product decision.",
  subtitle: `Case-study summary · ${siteIdentity.author}`,
  sections: [
    {
      heading: "My contribution",
      paragraphs: [siteIdentity.role, siteIdentity.team],
    },
    ...caseStudySections.map((section) => ({
      heading: `${section.number} / ${section.label}`,
      paragraphs: [
        section.title,
        ...("intro" in section ? [section.intro] : []),
      ],
    })),
    {
      heading: "Ownership and evidence",
      paragraphs: [siteIdentity.boundaries, siteIdentity.reconstruction],
    },
  ],
};
