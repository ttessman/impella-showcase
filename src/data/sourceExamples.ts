import type { SourceReferenceData } from "../components/SourceReference";

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
  calculators: {
    title: "Dedicated calculator behavior",
    paths: [
      "screens/CalculatorScreen.tsx",
      "components/{AKI,PAPi,CPO,Heparin}Calculator",
      "util/*_calculator.js",
      "architecture/content/calculators.md",
    ],
    summary:
      "A calculator type selects a dedicated component. Its form inputs feed existing deterministic helpers; CMS fields supply presentation copy.",
    example: `// Illustrative dispatch; no clinical math
const tool = supportedTools[record.toolType];

return <tool.View
  labels={record.labels}
  values={formValues}
  result={tool.evaluate(formValues)}
/>;`,
  },
} satisfies Record<string, SourceReferenceData>;
