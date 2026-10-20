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
  { ignores: ["dist", "node_modules", "test-results", "playwright-report"] },
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
    files: ["src/components/CMS/bundles/**/*.tsx"],
    ignores: ["**/*Bundle.tsx", "**/*Fields.tsx"],
    rules: { "local/cms-base-boundary": "error" },
  },
);
