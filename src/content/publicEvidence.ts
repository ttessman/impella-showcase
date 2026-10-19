import { storeLinks } from "./evidence";

/** Primary public sources checked October 19, 2026; product facts, not personal metrics. */
export const publicEvidence = {
  title: "From modernization to a production release.",
  items: [
    {
      label: "March 6, 2023",
      title: "A documented redesign",
      body: "Apple’s history identifies version 3.3.1 as the application redesign. Version 3.3.2 followed on March 10 with bug fixes.",
      sources: [{ title: "Apple version history", href: storeLinks.apple }],
    },
    {
      label: "Public feedback",
      title: "Encouragement, with unresolved friction",
      body: "A March 17, 2023 review praised the new layout. Other visible Apple reviews raised video issues in 2021 and sign-in eligibility concerns on March 9, 2023. This small, mixed sample does not establish overall satisfaction.",
      sources: [
        {
          title: "Apple ratings and reviews",
          href: storeLinks.apple,
        },
      ],
    },
    {
      label: "Later releases",
      title: "Availability beyond the project",
      body: "Apple records updates in 2024 and December 2025. Both store pages remain available; Google Play lists the same Android package as Clinical Care, with 10K+ lifetime downloads and a December 2025 update. That total is not redesign-era adoption or active usage.",
      sources: [
        { title: "Apple App Store", href: storeLinks.apple },
        { title: "Google Play", href: storeLinks.google },
      ],
    },
  ],
  note: "Public product evidence reviewed October 19, 2026. Release history supports later updates; it does not verify that the original rendering engine remains unchanged or attribute those releases to my work.",
} as const;
