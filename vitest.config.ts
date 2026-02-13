import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "cli",
          globals: true,
          environment: "node",
          include: ["tests/cli/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "app",
          globals: true,
          environment: "jsdom",
          include: ["tests/app/**/*.test.tsx"],
        },
      },
    ],
  },
});
