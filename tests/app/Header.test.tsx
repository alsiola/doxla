import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("../../src/app/src/assets/logo.svg", () => ({
  default: "logo.svg",
}));

import { Header } from "../../src/app/src/components/layout/Header";
import type { DocFile } from "../../src/app/src/types/manifest";

const mockDocs: DocFile[] = [
  { slug: "readme", path: "README.md", title: "README", content: "# Hello" },
];

describe("Header", () => {
  it("renders the repo name", () => {
    render(
      <Header
        repoName="my-project"
        docs={mockDocs}
        theme="light"
        onToggleTheme={() => {}}
      />
    );
    expect(screen.getByText("my-project")).toBeTruthy();
  });

  it("renders the search input", () => {
    render(
      <Header
        repoName="my-project"
        docs={mockDocs}
        theme="light"
        onToggleTheme={() => {}}
      />
    );
    expect(screen.getByPlaceholderText("Search docs...")).toBeTruthy();
  });

  it("renders the theme toggle button", () => {
    render(
      <Header
        repoName="my-project"
        docs={mockDocs}
        theme="light"
        onToggleTheme={() => {}}
      />
    );
    expect(screen.getByLabelText("Switch to dark mode")).toBeTruthy();
  });

  it("renders the MobileNav hamburger button", () => {
    render(
      <Header
        repoName="my-project"
        docs={mockDocs}
        theme="light"
        onToggleTheme={() => {}}
      />
    );
    expect(screen.getByLabelText("Open navigation")).toBeTruthy();
  });

  it("navigates to search on form submit", () => {
    render(
      <Header
        repoName="my-project"
        docs={mockDocs}
        theme="light"
        onToggleTheme={() => {}}
      />
    );
    const input = screen.getByPlaceholderText("Search docs...");
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.submit(input.closest("form")!);
    expect(window.location.hash).toBe(
      `#/search?q=${encodeURIComponent("test query")}`
    );
  });
});
