import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout } from "../../src/app/src/components/mdx/Callout";

describe("Callout", () => {
  it("renders children", () => {
    render(<Callout>Hello world</Callout>);
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  it("defaults to info type", () => {
    render(<Callout>Info message</Callout>);
    expect(screen.getByText("Info")).toBeTruthy();
  });

  it("renders warning type", () => {
    render(<Callout type="warning">Be careful</Callout>);
    expect(screen.getByText("Warning")).toBeTruthy();
    expect(screen.getByText("Be careful")).toBeTruthy();
  });

  it("renders danger type", () => {
    render(<Callout type="danger">Critical issue</Callout>);
    expect(screen.getByText("Danger")).toBeTruthy();
    expect(screen.getByText("Critical issue")).toBeTruthy();
  });
});
