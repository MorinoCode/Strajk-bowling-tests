import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      exclude: [
        "**/*.scss",
        "**/*.css",
        "**/*.svg",
        "**/mocks/**",
      ],
    },
  },
});