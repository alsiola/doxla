import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../src/app/src/components/ui/Sheet";

describe("Sheet", () => {
  it("renders content when open", () => {
    render(
      <Sheet open={true} onClose={() => {}}>
        <SheetOverlay />
        <SheetContent>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText("Sheet content")).toBeTruthy();
  });

  it("does not render content when closed", () => {
    render(
      <Sheet open={false} onClose={() => {}}>
        <SheetOverlay />
        <SheetContent>
          <p>Sheet content</p>
        </SheetContent>
      </Sheet>
    );
    expect(screen.queryByText("Sheet content")).toBeNull();
  });

  it("has correct ARIA attributes", () => {
    render(
      <Sheet open={true} onClose={() => {}}>
        <SheetContent>
          <p>Accessible</p>
        </SheetContent>
      </Sheet>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = vi.fn();
    render(
      <Sheet open={true} onClose={onClose}>
        <SheetOverlay />
        <SheetContent>
          <p>Content</p>
        </SheetContent>
      </Sheet>
    );
    // The overlay is the aria-hidden div
    const overlay = document.querySelector("[aria-hidden='true']")!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <Sheet open={true} onClose={onClose}>
        <SheetContent>
          <p>Content</p>
        </SheetContent>
      </Sheet>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Sheet open={true} onClose={onClose}>
        <SheetContent>
          <p>Content</p>
        </SheetContent>
      </Sheet>
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders SheetHeader and SheetTitle", () => {
    render(
      <Sheet open={true} onClose={() => {}}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Title</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
    expect(screen.getByText("My Title")).toBeTruthy();
  });
});
