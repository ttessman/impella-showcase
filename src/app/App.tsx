import { TooltipProvider } from "../components/overlays/Tooltip/TooltipProvider";
import { CaseStudyPage } from "../features/CaseStudy/CaseStudyPage";
export default function App() {
  return (
    <TooltipProvider delayDuration={350}>
      <CaseStudyPage />
    </TooltipProvider>
  );
}
