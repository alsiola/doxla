import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileTree } from "../../src/app/src/components/FileTree";
import type { DocFile } from "../../src/app/src/types/manifest";

const mockDocs: DocFile[] = [
  { slug: "readme", path: "README.md", title: "README", content: "# Hello" },
  {
    slug: "docs/guide",
    path: "docs/guide.md",
    title: "Guide",
    content: "# Guide",
  },
  {
    slug: "docs/api",
    path: "docs/api.md",
    title: "API",
    content: "# API",
  },
];

describe("FileTree", () => {
  it("renders file names", () => {
    render(<FileTree docs={mockDocs} />);
    expect(screen.getByText("README.md")).toBeTruthy();
  });

  it("renders folder names", () => {
    render(<FileTree docs={mockDocs} />);
    expect(screen.getByText("docs")).toBeTruthy();
  });

  it("creates links to doc pages", () => {
    render(<FileTree docs={mockDocs} />);
    const readmeLink = screen.getByText("README.md").closest("a");
    expect(readmeLink?.getAttribute("href")).toBe("#/doc/readme");
  });
});
