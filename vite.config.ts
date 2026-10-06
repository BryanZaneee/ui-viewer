import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  base: process.env.BASE_PATH || "/ui-viewer/",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    proxy: {
      "/ui-viewer/api": {
        target: "http://127.0.0.1:8040",
        rewrite: (path) => path.replace(/^\/ui-viewer/, ""),
      },
    },
  },
  preview: {
    proxy: {
      "/ui-viewer/api": {
        target: "http://127.0.0.1:8040",
        rewrite: (path) => path.replace(/^\/ui-viewer/, ""),
      },
    },
  },
  build: {
    rollupOptions: { input: { main: "index.html", preview: "preview.html" } },
  },
});
