import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IndexPage } from "../../src/app/src/components/IndexPage";
import type { DocFile } from "../../src/app/src/types/manifest";

const mockDocs: DocFile[] = [
  {
    slug: "readme",
    path: "README.md",
    title: "Getting Started",
    content: "# Getting Started\n\nWelcome to the project.",
  },
  {
    slug: "docs/api",
    path: "docs/api.md",
    title: "API Reference",
    content: "# API Reference\n\nEndpoints documentation.",
  },
];

describe("IndexPage", () => {
  it("shows total document count", () => {
    render(<IndexPage docs={mockDocs} />);
    expect(screen.getByText(/2 documents found/)).toBeTruthy();
  });

  it("renders doc cards with titles", () => {
    render(<IndexPage docs={mockDocs} />);
    expect(screen.getByText("Getting Started")).toBeTruthy();
    expect(screen.getByText("API Reference")).toBeTruthy();
  });

  it("shows directory badge for nested docs", () => {
    render(<IndexPage docs={mockDocs} />);
    expect(screen.getByText("docs")).toBeTruthy();
  });

  it("creates links to doc pages", () => {
    render(<IndexPage docs={mockDocs} />);
    const link = screen.getByText("Getting Started").closest("a");
    expect(link?.getAttribute("href")).toBe("#/doc/readme");
  });

  it("strips nested/malformed HTML tags from preview", () => {
    const docs: DocFile[] = [
      {
        slug: "test",
        path: "test.md",
        title: "Test",
        content:
          "# Test\n\n<scr<script>ipt>alert('xss')</scr</script>ipt> safe text",
      },
    ];
    render(<IndexPage docs={docs} />);
    const description = document.querySelector(".text-sm.text-muted-foreground");
    expect(description?.textContent).not.toContain("<");
    expect(description?.textContent).not.toContain(">");
    expect(description?.textContent).toContain("safe text");
  });

  it("strips simple HTML tags from preview", () => {
    const docs: DocFile[] = [
      {
        slug: "test",
        path: "test.md",
        title: "Test",
        content: "# Test\n\n<p><img src=\"test.png\" /></p>Some text here",
      },
    ];
    render(<IndexPage docs={docs} />);
    expect(screen.getByText("Some text here")).toBeTruthy();
  });
});
