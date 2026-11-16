import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two static pages: the landing page and /season-0/. Each is plain HTML, so the
      // host serves /season-0/ directly with no SPA fallback needed.
      input: {
        main: "index.html",
        season0: "season-0/index.html",
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  }
});
