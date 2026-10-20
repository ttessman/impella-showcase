import { TooltipProvider } from "../components/UI/Tooltip/TooltipProvider";
import { CaseStudy } from "../components/UI/CaseStudy/CaseStudy";
export default function App() {
  return (
    <TooltipProvider delayDuration={350}>
      <CaseStudy />
    </TooltipProvider>
  );
}
