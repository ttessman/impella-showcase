import { CaseStudyReader } from "../features/CaseStudy/components/CaseStudyReader/CaseStudyReader";
import { TooltipProvider } from "../components/overlays/Tooltip/Tooltip";
import { CaseStudyNavigation } from "../features/CaseStudy/components/CaseStudyNavigation/CaseStudyNavigation";
import { caseStudySections } from "../content/caseStudy";
import { SiteFooter } from "../components/layout/SiteFooter/SiteFooter";
import { PublicEvidence } from "../features/CaseStudy/components/PublicEvidence/PublicEvidence";
import { CaseStudyPage } from "../features/CaseStudy/CaseStudyPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={350}>
      <a className="skip-link" href="#main">
        Skip to case study
      </a>
      <CaseStudyNavigation sections={caseStudySections} />
      <CaseStudyPage />
      <SiteFooter
        slots={{ evidence: <PublicEvidence />, reader: <CaseStudyReader /> }}
      />
    </TooltipProvider>
  );
}
