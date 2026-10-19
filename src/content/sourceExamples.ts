import type { SourceReferenceData } from "../types/sourceReference";

// Independently written examples explain mechanisms; no private source is copied.
export const sourceExamples = {
  collections: {
    title: "One collection model, two layouts",
    paths: [
      "components/CollectionContent",
      "CMS/CollectionBlock",
      "architecture/content/collections.md",
    ],
    summary:
      "The number of resource groups selects continuous or grouped presentation. Both layouts reuse resource cards.",
    example: `// Simplified educational example
const mode = resourceGroups.length > 1
  ? "grouped"
  : "continuous";

return <CollectionView
  groups={resourceGroups}
  mode={mode}
  renderCard={renderResource}
/>;`,
  },
  navigation: {
    title: "Selecting regional navigation",
    paths: [
      "redux/menus/menus.selectors.ts",
      "hooks/useTabNavigatorScreens.tsx",
      "architecture/menus.md",
    ],
    summary:
      "Menu selection uses region and language. The app resolves the selected records into supported destinations.",
    example: `// Conceptual shape; not the original payload
const regionalMenus = menusByRegion[region];
const items = regionalMenus[language];

return items.map(item => ({
  label: item.label,
  icon: item.icon,
  destination: resolveSupportedRoute(item),
}));`,
  },
  checklists: {
    title: "Authored questions and conditional results",
    fileNotes: {
      "components/CheckListContent/ChecklistContent.tsx":
        "Renders question groups, collects selections and evaluates result conditions on submit. Matching content uses ContentView and is scrolled into view.",
      "architecture/content/checklists.md":
        "Documents author-configured question groups, selectable options, AND/OR conditions, result content and supporting references.",
    },
    paths: [
      "components/CheckListContent/ChecklistContent.tsx",
      "architecture/content/checklists.md",
    ],
    summary:
      "On submit, selected options are matched against authored AND/OR conditions. The first matching result or fallback renders through ContentView and scrolls into view.",
    example: `// Independent illustration; no clinical rules
const outcome = selectAuthoredOutcome({
  selectedOptions,
  configuredConditions,
});

return <ContentView blocks={outcome.blocks} />;`,
  },
  calculators: {
    title: "Dedicated calculator behavior",
    fileNotes: {
      "screens/CalculatorScreen.tsx":
        "Chooses a dedicated tool component from the calculator record.",
      "components/{AKI,PAPi,CPO,Heparin}Calculator":
        "Connects watched form values, shared input controls, helper calls and result presentation; resets on navigation blur.",
      "util/*_calculator.js":
        "Existing calculation helpers integrated by the frontend. Formula authorship and clinical validation are outside the portfolio claim.",
      "architecture/content/calculators.md":
        "Explains the expected field order and CMS-authored labels, descriptions and units. Tool behavior remains in native application code.",
    },
    paths: [
      "screens/CalculatorScreen.tsx",
      "components/{AKI,PAPi,CPO,Heparin}Calculator",
      "util/*_calculator.js",
      "architecture/content/calculators.md",
    ],
    summary:
      "Dedicated components watch form values, call existing helpers and share result presentation. CMS fields supply copy in a fixed order; forms reset when users leave the screen.",
    example: `// Independent frontend illustration; no clinical math
// A dedicated two-input tool, rather than generic CMS dispatch.
function CalculatorExample({ record, navigation }) {
  const [first, second, output] = record.calculator_components;
  const { control, watch, reset } = useForm({
    defaultValues: { first: 0, second: 0 },
  });
  const values = watch();

  useEffect(() => navigation.addListener(
    "blur", () => reset()
  ), [navigation, reset]);

  // Provided helper; formula deliberately omitted.
  const result = providedCalculationHelper(values);
  const showResult = toolSpecificResultCheck(values);

  return <>
    <CalculatorSlider
      name="first" control={control}
      title={first.header} unit={first.unit}
    />
    <CalculatorSlider
      name="second" control={control}
      title={second.header} unit={second.unit}
    />
    {showResult && <ResultsBlock
      header={output.results_header}
      results={[{
        name: output.results_labels[0],
        score: result,
      }]}
    />}
  </>;
}`,
  },
} satisfies Record<string, SourceReferenceData>;
