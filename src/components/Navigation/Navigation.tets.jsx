import { render, screen } from "@testing-library/react";
import Navigation from "./Navigation";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Navigation Component", () => {
  const setup = () =>
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe("UI Rendering and Menu Toggle", () => {
    it("renders navigation icon", () => {
      setup();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("menu is hidden by default", () => {
      setup();
      expect(screen.getByText("Booking")).toHaveClass("hide");
      expect(screen.getByText("Confirmation")).toHaveClass("hide");
    });

    it("opens the menu when clicking the icon", async () => {
      setup();
      await userEvent.click(screen.getByRole("img"));

      expect(screen.getByText("Booking")).not.toHaveClass("hide");
      expect(screen.getByText("Confirmation")).not.toHaveClass("hide");
    });

    it("closes the menu when clicking icon twice", async () => {
      setup();

      const icon = screen.getByRole("img");
      await userEvent.click(icon); // open
      await userEvent.click(icon); // close

      expect(screen.getByText("Booking")).toHaveClass("hide");
      expect(screen.getByText("Confirmation")).toHaveClass("hide");
    });
  });

  describe("Navigation link behavior", () => {
    it("navigates to Booking", async () => {
      setup();
      await userEvent.click(screen.getByRole("img")); // open menu

      await userEvent.click(screen.getByText("Booking"));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to Confirmation", async () => {
      setup();
      await userEvent.click(screen.getByRole("img"));

      await userEvent.click(screen.getByText("Confirmation"));
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });

    it("clicking Booking when menu is closed still navigates", async () => {
      setup();
      await userEvent.click(screen.getByText("Booking"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("clicking Confirmation when menu is closed still navigates", async () => {
      setup();
      await userEvent.click(screen.getByText("Confirmation"));

      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });
  });
});
