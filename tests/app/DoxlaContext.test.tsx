import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DoxlaProvider, useDoxla } from "../../src/app/src/context/DoxlaContext";

function ThemeDisplay() {
  const { theme } = useDoxla();
  return <span data-testid="theme">{theme}</span>;
}

describe("DoxlaContext", () => {
  it("provides theme value to children", () => {
    render(
      <DoxlaProvider theme="light">
        <ThemeDisplay />
      </DoxlaProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("provides dark theme value", () => {
    render(
      <DoxlaProvider theme="dark">
        <ThemeDisplay />
      </DoxlaProvider>
    );
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("throws when useDoxla is used outside DoxlaProvider", () => {
    expect(() => render(<ThemeDisplay />)).toThrow(
      "useDoxla must be used within a DoxlaProvider"
    );
  });
});
