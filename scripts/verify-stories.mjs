import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import console from "node:console";
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(`${dir}/${entry.name}`)
          : `${dir}/${entry.name}`,
      ),
    )
  ).flat();
}
const components = (await files("src/components")).filter((path) =>
  path.endsWith(".tsx"),
);
const stories = (await files("stories")).filter((path) =>
  path.endsWith(".stories.tsx"),
);
const coverage = new Set();
let examples = 0;
for (const path of stories) {
  const source = await readFile(path, "utf8");
  const target = source.match(/componentPath:\s*["']([^"']+)["']/)?.[1];
  assert(target, `${path}: componentPath required for coverage`);
  assert(!coverage.has(target), `${path}: duplicate component coverage`);
  coverage.add(target);
  examples += [...source.matchAll(/export const \w+/g)].length;
}
for (const path of components)
  assert(coverage.has(path), `Missing component stories: ${path}`);
for (const path of coverage)
  assert(components.includes(path), `Stale story: ${path}`);
console.log(
  `Storybook coverage: ${components.length} components, ${examples} examples; UI and CMS folders complete.`,
);
