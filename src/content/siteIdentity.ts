import { caseStudyCopy } from "./caseStudy";

/** Attribution describes the original project; it does not claim authorship of the whole app. */
export const siteIdentity = {
  title: "Impella modernization — Tyler Tessmann, frontend engineer",
  description:
    "Tyler Tessmann’s work on Impella: native React Native CMS rendering, content contracts, calculators, Okta sign-in frontend, favorites and authoring workflows.",
  author: "Tyler Tessmann",
  role: caseStudyCopy.overview.contribution,
  team: caseStudyCopy.overview.team,
  boundaries:
    "The wider team delivered the application and production content. Okta tenant setup and clinical formula authorship or independent clinical validation are not claimed. Offline caching is a broader product capability without individual ownership attribution.",
  reconstruction:
    "The Content studio is an independently written React web reconstruction with fictional, nonclinical content. Original React Native implementation files, credentials and private history are not published here. Generic recursive sections are a demo extension. Future semantic search/RAG was not shipped.",
} as const;
