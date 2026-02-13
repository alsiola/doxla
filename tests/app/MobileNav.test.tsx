import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MobileNav } from "../../src/app/src/components/layout/MobileNav";
import type { DocFile } from "../../src/app/src/types/manifest";

const mockDocs: DocFile[] = [
  { slug: "readme", path: "README.md", title: "README", content: "# Hello" },
  {
    slug: "docs-guide",
    path: "docs/guide.md",
    title: "Guide",
    content: "# Guide",
  },
];

describe("MobileNav", () => {
  it("renders the hamburger button", () => {
    render(<MobileNav docs={mockDocs} />);
    expect(screen.getByLabelText("Open navigation")).toBeTruthy();
  });

  it("opens the sheet when hamburger is clicked", () => {
    render(<MobileNav docs={mockDocs} />);
    fireEvent.click(screen.getByLabelText("Open navigation"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Documents")).toBeTruthy();
  });

  it("shows FileTree inside the sheet", () => {
    render(<MobileNav docs={mockDocs} />);
    fireEvent.click(screen.getByLabelText("Open navigation"));
    expect(screen.getByText("README.md")).toBeTruthy();
  });

  it("closes the sheet on hashchange", () => {
    render(<MobileNav docs={mockDocs} />);
    fireEvent.click(screen.getByLabelText("Open navigation"));
    expect(screen.getByRole("dialog")).toBeTruthy();

    // Simulate navigation
    act(() => {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
