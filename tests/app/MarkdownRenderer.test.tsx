import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "../../src/app/src/components/MarkdownRenderer";

describe("MarkdownRenderer", () => {
  it("renders a heading", () => {
    render(<MarkdownRenderer theme="light" content="# Hello World" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.getByText("Hello World")).toBeTruthy();
  });

  it("renders paragraphs", () => {
    render(<MarkdownRenderer theme="light" content="Some paragraph text." />);
    expect(screen.getByText("Some paragraph text.")).toBeTruthy();
  });

  it("renders links", () => {
    render(<MarkdownRenderer theme="light" content="[Click here](https://example.com)" />);
    const link = screen.getByText("Click here");
    expect(link.closest("a")?.getAttribute("href")).toBe(
      "https://example.com"
    );
  });
});
