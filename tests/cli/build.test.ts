import { describe, it, expect, vi } from "vitest";
import { getTemplatePath } from "../../src/cli/lib/template";
import { existsSync } from "node:fs";

describe("build utilities", () => {
  describe("getTemplatePath", () => {
    it("returns a path that exists", () => {
      const templatePath = getTemplatePath();
      expect(existsSync(templatePath)).toBe(true);
    });

    it("template path contains expected files", () => {
      const templatePath = getTemplatePath();
      expect(existsSync(`${templatePath}/package.json`)).toBe(true);
      expect(existsSync(`${templatePath}/index.html`)).toBe(true);
      expect(existsSync(`${templatePath}/vite.config.ts`)).toBe(true);
    });
  });
});
