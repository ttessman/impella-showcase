import { storeLinks } from "./evidence";

/** Primary public sources checked October 19, 2026; product facts, not personal metrics. */
export const publicEvidence = {
  title: "Product history & public sources",
  items: [
    {
      label: "March 6, 2023",
      title: "A documented redesign",
      body: "Apple records the redesign in version 3.3.1. Version 3.3.2 followed with bug fixes.",
      sources: [{ title: "Apple version history", href: storeLinks.apple }],
    },
    {
      label: "Public feedback",
      title: "Mixed user feedback",
      body: "Apple reviews include praise for the layout in March 2023, alongside video and sign-in complaints. This small sample is mixed.",
      sources: [
        {
          title: "Apple ratings and reviews",
          href: storeLinks.apple,
        },
      ],
    },
    {
      label: "Later releases",
      title: "Later updates & availability",
      body: "Both listings remain available, with updates through December 2025. Google Play lists the Android package as Clinical Care and reports 10K+ lifetime downloads.",
      sources: [
        { title: "Apple App Store", href: storeLinks.apple },
        { title: "Google Play", href: storeLinks.google },
      ],
    },
  ],
  note: "Reviewed October 19, 2026. Product-level context: reviews and lifetime downloads do not measure my contribution or redesign-era adoption; later releases do not establish unchanged source code.",
} as const;
