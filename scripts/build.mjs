import process from "node:process";
import { spawnSync } from "node:child_process";
function run(script) {
  const result = spawnSync("npm", ["run", script], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run("build:app");
if (process.env.STORYBOOK_ENABLED !== "false") {
  run("verify:stories");
  run("build:storybook");
  const result = spawnSync(
    process.execPath,
    ["scripts/package-storybook.mjs"],
    { stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
