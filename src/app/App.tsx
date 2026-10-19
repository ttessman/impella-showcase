import { TooltipProvider } from "../components/overlays/Tooltip/Tooltip";
import { CaseStudyNavigation } from "../features/CaseStudy/components/CaseStudyNavigation/CaseStudyNavigation";
import { caseStudySections } from "../content/caseStudy";
import { SiteFooter } from "../components/layout/SiteFooter/SiteFooter";
import { CaseStudyPage } from "../features/CaseStudy/CaseStudyPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={350}>
      <a className="skip-link" href="#main">
        Skip to case study
      </a>
      <CaseStudyNavigation sections={caseStudySections} />
      <CaseStudyPage />
      <SiteFooter />
    </TooltipProvider>
  );
}
