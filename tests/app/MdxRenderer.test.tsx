import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MdxRenderer } from "../../src/app/src/components/MdxRenderer";

describe("MdxRenderer", () => {
  it("renders a heading from MDX content", async () => {
    render(<MdxRenderer theme="light" content="# Hello MDX" />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
      expect(screen.getByText("Hello MDX")).toBeTruthy();
    });
  });

  it("renders paragraphs", async () => {
    render(<MdxRenderer theme="light" content="A simple paragraph." />);
    await waitFor(() => {
      expect(screen.getByText("A simple paragraph.")).toBeTruthy();
    });
  });

  it("renders JSX expressions", async () => {
    render(<MdxRenderer theme="light" content={"Result: {1 + 2}"} />);
    await waitFor(() => {
      expect(screen.getByText(/Result:/)).toBeTruthy();
      expect(screen.getByText(/3/)).toBeTruthy();
    });
  });

  it("renders Callout component", async () => {
    const content = `<Callout type="warning">Watch out!</Callout>`;
    render(<MdxRenderer theme="light" content={content} />);
    await waitFor(() => {
      expect(screen.getByText("Watch out!")).toBeTruthy();
      expect(screen.getByText("Warning")).toBeTruthy();
    });
  });

  it("shows error for invalid MDX", async () => {
    const content = "<<<invalid mdx syntax>>>";
    render(<MdxRenderer theme="light" content={content} />);
    await waitFor(() => {
      expect(screen.getByText("MDX Error")).toBeTruthy();
    });
  });

  it("renders markdown alongside JSX", async () => {
    const content = "**Bold** and *italic* with {2 + 2}";
    render(<MdxRenderer theme="light" content={content} />);
    await waitFor(() => {
      expect(screen.getByText(/Bold/)).toBeTruthy();
      expect(screen.getByText(/4/)).toBeTruthy();
    });
  });

  it("renders code blocks without a language as styled blocks", async () => {
    const content = "```\nconst x = 1;\n```";
    const { container } = render(<MdxRenderer theme="light" content={content} />);
    await waitFor(() => {
      const inlineCode = container.querySelector("code.rounded");
      expect(inlineCode).toBeNull();
      expect(screen.getByText("const x = 1;")).toBeTruthy();
    });
  });

  it("renders inline code as inline elements", async () => {
    render(<MdxRenderer theme="light" content="Use `foo` here" />);
    await waitFor(() => {
      const codeEl = screen.getByText("foo");
      expect(codeEl.tagName).toBe("CODE");
      expect(codeEl.className).toContain("rounded");
    });
  });

  it("resolves relative .mdx links to app routes", async () => {
    const content = "[Link](../other.mdx)";
    render(<MdxRenderer theme="light" content={content} docPath="guides/test.mdx" />);
    await waitFor(() => {
      const link = screen.getByText("Link").closest("a");
      expect(link?.getAttribute("href")).toBe("#/doc/other");
    });
  });

  it("resolves relative .md links from MDX pages", async () => {
    const content = "[Guide](installation.md)";
    render(<MdxRenderer theme="light" content={content} docPath="getting-started/quick-start.mdx" />);
    await waitFor(() => {
      const link = screen.getByText("Guide").closest("a");
      expect(link?.getAttribute("href")).toBe("#/doc/getting-started/installation");
    });
  });
});
