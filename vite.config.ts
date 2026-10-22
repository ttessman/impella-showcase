import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [
    react(),
    {
      name: "storybook-development-route",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const url = request.url ?? "";
          if (url === "/storybook" || url.startsWith("/storybook/")) {
            response.writeHead(302, {
              Location: `http://127.0.0.1:6006/${url.replace(/^\/storybook\/?/, "")}`,
            });
            response.end();
            return;
          }
          next();
        });
      },
    },
  ],
  base: "./",
  build: { sourcemap: false },
});
