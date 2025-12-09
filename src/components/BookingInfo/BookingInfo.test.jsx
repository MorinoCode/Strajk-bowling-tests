import { render, screen } from "@testing-library/react";
import BookingInfo from "./BookingInfo";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";


describe("BookingInfo Component", () => {

  it("renders all input fields", () => {
    /*
    * Kriterier:
    * - G: Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem.
    * - G: Användaren ska kunna ange antal spelare (minst 1 spelare).
    * - G: Användaren ska kunna reservera ett eller flera banor beroende på antal spelare.
    */
    render(<BookingInfo updateBookingDetails={() => {}} />);

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Number of awesome bowlers")).toBeInTheDocument();
    expect(screen.getByLabelText("Number of lanes")).toBeInTheDocument();
  });

  it("calls updateBookingDetails when changing Date", async () => {
    // Användaren ska kunna välja ett datum... från ett kalender-... valsystem.
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(screen.getByLabelText("Date"), "2024-10-10");

    expect(mockFn).toHaveBeenCalled();
  });

  it("calls updateBookingDetails when changing Time", async () => {
    // Användaren ska kunna välja... en tid från ett... tidvalssystem.
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(screen.getByLabelText("Time"), "10:30");

    expect(mockFn).toHaveBeenCalled();
  });

  it("calls updateBookingDetails when changing number of people", async () => {
    // Användaren ska kunna ange antal spelare (minst 1 spelare).
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    // Använder getByLabelText
    await user.type(screen.getByLabelText("Number of awesome bowlers"), "3");

    expect(mockFn).toHaveBeenCalled();
  });

  it("calls updateBookingDetails when changing number of lanes", async () => {
    // Användaren ska kunna reservera ett eller flera banor beroende på antal spelare.
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(screen.getByLabelText("Number of lanes"), "2");

    expect(mockFn).toHaveBeenCalled();
  });
});