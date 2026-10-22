import {
  cmsAdapterBoundary,
  cmsBaseBoundary,
} from "./tooling/eslint/cms-boundaries.mjs";
import { oneComponentPerFile } from "./tooling/eslint/one-component-per-file.mjs";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";
export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      "test-results",
      "playwright-report",
      "storybook-static",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": hooks, "react-refresh": refresh },
    rules: {
      ...hooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["stories/**/*.{ts,tsx}", ".storybook/**/*.{ts,tsx}"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["src/**/*.tsx"],
    plugins: {
      local: {
        rules: {
          "one-component-per-file": oneComponentPerFile,
          "cms-adapter-boundary": cmsAdapterBoundary,
          "cms-base-boundary": cmsBaseBoundary,
        },
      },
    },
    rules: { "local/one-component-per-file": "error" },
  },
  {
    files: ["src/components/CMS/bundles/**/*Bundle.tsx"],
    rules: { "local/cms-adapter-boundary": "error" },
  },
  {
    files: ["src/components/UI/ContentStudio/PageComposer.tsx"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowExportNames: ["bundles"] },
      ],
    },
  },
  {
    files: ["src/components/UI/**/*.tsx"],
    ignores: [
      "src/components/UI/ContentStudio/**",
      "src/components/UI/CaseStudy/**",
    ],
    rules: { "local/cms-base-boundary": "error" },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/UI/Icon/Icon.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@radix-ui/react-icons",
              message: "Use the shared UI/Icon registry and semantic names.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/UI/CaseStudy/CaseStudy.tsx"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: ["pageDocument", "pageIndex"],
        },
      ],
    },
  },
  {
    files: ["src/components/CMS/bundles/MediaBundle/MediaFields.tsx"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true, allowExportNames: ["imageOptions"] },
      ],
    },
  },
);
