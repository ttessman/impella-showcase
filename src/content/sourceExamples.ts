import type { SourceReferenceData } from "../types/sourceReference";

// Independent illustrations and descriptive source summaries; no private source copied.
export const sourceExamples = {
  collections: {
    title: "One collection model, two layouts",
    summary:
      "The number of resource groups selects continuous or grouped presentation. Both layouts reuse resource cards.",
    files: [
      {
        path: "components/CollectionContent",
        context:
          "Selects continuous or grouped presentation from the resource groups.",
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
      {
        path: "CMS/CollectionBlock",
        context: "Connects collection entries to shared resource cards.",
        example: `// Independent composition illustration
return group.resources.map(resource => (
  <ResourceCard key={resource.id} resource={resource} />
));`,
      },
      {
        path: "architecture/content/collections.md",
        context:
          "Documents titles, optional headers, grouped resources and the scrolling layouts.",
        example: `// Documentation summary; not an API payload
Collection
  title + optional header
  resource groups
    resources → shared cards

One group: continuous list
Multiple groups: grouped presentation`,
      },
    ],
  },
  navigation: {
    title: "Selecting regional navigation",
    summary:
      "Menu selection uses region and language. The app resolves the selected records into supported destinations.",
    files: [
      {
        path: "redux/menus/menus.selectors.ts",
        context: "Selects menu records for the user’s region and language.",
        example: `// Independent selector illustration
const regionalMenus = menusByRegion[region];
const selectedMenu = regionalMenus[language];`,
      },
      {
        path: "hooks/useTabNavigatorScreens.tsx",
        context:
          "Maps selected labels, icons and destinations to supported native screens.",
        example: `// Conceptual shape; not the original payload
const regionalMenus = menusByRegion[region];
const items = regionalMenus[language];

return items.map(item => ({
  label: item.label,
  icon: item.icon,
  destination: resolveSupportedRoute(item),
}));`,
      },
      {
        path: "architecture/menus.md",
        context:
          "Describes authored regional menus; new route behavior still requires app code.",
        example: `// Documentation summary; not an API payload
Region + language
  → configured menu records
  → labels, icons, ordering and links
  → supported native destinations`,
      },
    ],
  },
  checklists: {
    title: "Authored questions and conditional results",
    summary:
      "Selected options match authored AND/OR conditions on submit. The first matching result or fallback renders through ContentView.",
    files: [
      {
        path: "components/CheckListContent/ChecklistContent.tsx",
        context:
          "Collects grouped selections, evaluates conditions on submit and scrolls matching result content into view.",
        example: `// Independent illustration; no clinical rules
const outcome = selectAuthoredOutcome({
  selectedOptions,
  configuredConditions,
});

return <ContentView blocks={outcome.blocks} />;`,
      },
      {
        path: "architecture/content/checklists.md",
        context:
          "Documents accordion groups, question labels/options, authored results and supporting references.",
        example: `// Independent structural illustration
Checklist
  accordion group
    question label
    selectable options
    another question + options
  AND / OR result conditions
  result headers + text
  references + disclaimer`,
      },
    ],
  },
  calculators: {
    title: "Dedicated calculator behavior",
    summary:
      "Dedicated components watch inputs, call existing helpers and share results. CMS copy follows a fixed field order; forms reset on navigation blur.",
    initialFile: "components/{AKI,PAPi,CPO,Heparin}Calculator",
    files: [
      {
        path: "screens/CalculatorScreen.tsx",
        context: "Selects a dedicated native tool from the calculator record.",
        example: `// Independent screen-dispatch illustration
const tool = supportedTools[record.calculator_type];
return <tool.Component contentUrl={record.content_url} />;`,
      },
      {
        path: "components/{AKI,PAPi,CPO,Heparin}Calculator",
        context:
          "Connects watched inputs, reusable controls, helper integration and conditional results. Resets on navigation blur.",
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
      {
        path: "util/*_calculator.js",
        context:
          "Provided calculation helpers consumed by the frontend. Formula authorship and clinical validation are outside this contribution.",
        example: `// Helper integration boundary; no clinical math
const values = watch();
const result = providedCalculationHelper(values);

// The frontend presents the supplied result.
// Formulas and clinical thresholds are omitted.`,
      },
      {
        path: "architecture/content/calculators.md",
        context:
          "Documents fixed component order and CMS-authored labels, descriptions, units and result labels.",
        example: `// Independent two-input content illustration
// Fixed order expected by the dedicated component
calculator_components: [
  { header: "First input", unit: "…" },
  { header: "Second input", unit: "…" },
  { results_header: "Results", results_labels: ["Output"] }
]

// Changing tool structure requires native code.`,
      },
    ],
  },
} satisfies Record<string, SourceReferenceData>;
