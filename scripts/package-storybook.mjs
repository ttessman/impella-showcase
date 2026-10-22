import { cp, access } from "node:fs/promises";
await access("dist/index.html");
await access("storybook-static/index.html");
await cp("storybook-static", "dist/storybook", { recursive: true });
