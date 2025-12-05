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

  
  describe("Menu UI behavior", () => {
    it("renders navigation icon", () => {
      setup();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("menu is hidden by default", () => {
      setup();
      expect(screen.getByText("Booking")).toHaveClass("hide");
      expect(screen.getByText("Confirmation")).toHaveClass("hide");
    });

    it("toggles menu open and close (covers showMenu branch fully)", async () => {
      setup();
      const icon = screen.getByRole("img");

      // open
      await userEvent.click(icon);
      expect(screen.getByText("Booking")).not.toHaveClass("hide");

      // close
      await userEvent.click(icon);
      expect(screen.getByText("Booking")).toHaveClass("hide");
    });
  });

  describe("Navigation link behavior", () => {
    it("navigates to '/' when clicking Booking", async () => {
      setup();
      await userEvent.click(screen.getByRole("img")); // open menu
      await userEvent.click(screen.getByText("Booking"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("navigates to '/confirmation' when clicking Confirmation", async () => {
      setup();
      await userEvent.click(screen.getByRole("img"));
      await userEvent.click(screen.getByText("Confirmation"));

      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });

    it("clicking Booking while menu is closed still triggers navigation", async () => {
      setup();
      await userEvent.click(screen.getByText("Booking"));

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("clicking Confirmation while menu is closed still triggers navigation", async () => {
      setup();
      await userEvent.click(screen.getByText("Confirmation"));

      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });
  });
  
});
