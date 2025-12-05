import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import Top from "./Top";

vi.mock("../../assets/strajk-logo.svg", () => ({
  default: "mocked-logo.svg",
}));

describe("Top Component", () => {
  it("should render image and title", () => {
    render(<Top title="Title" />);

    const imgElement = screen.getByRole("img");

    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "mocked-logo.svg");

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toHaveTextContent("Title");
    
  });
});
