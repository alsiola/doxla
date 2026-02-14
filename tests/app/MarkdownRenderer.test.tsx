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

  it("renders code blocks without a language as styled blocks", () => {
    const content = "```\nconst x = 1;\n```";
    const { container } = render(<MarkdownRenderer theme="light" content={content} />);
    // Should use SyntaxHighlighter (renders a <div> with PreTag="div"), not inline <code>
    const inlineCode = container.querySelector("code.rounded");
    expect(inlineCode).toBeNull();
    expect(screen.getByText("const x = 1;")).toBeTruthy();
  });

  it("renders inline code as inline elements", () => {
    render(<MarkdownRenderer theme="light" content="Use `foo` here" />);
    const codeEl = screen.getByText("foo");
    expect(codeEl.tagName).toBe("CODE");
    expect(codeEl.className).toContain("rounded");
  });

  it("renders links", () => {
    render(<MarkdownRenderer theme="light" content="[Click here](https://example.com)" />);
    const link = screen.getByText("Click here");
    expect(link.closest("a")?.getAttribute("href")).toBe(
      "https://example.com"
    );
  });
});
