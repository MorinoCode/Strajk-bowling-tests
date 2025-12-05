import { render } from "@testing-library/react";
import BookingInfo from "./BookingInfo";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const input = (name) => document.querySelector(`input[name="${name}"]`);

describe("BookingInfo Component", () => {

  it("renders all input fields", () => {
    render(<BookingInfo updateBookingDetails={() => {}} />);

    expect(input("when")).toBeInTheDocument();
    expect(input("time")).toBeInTheDocument();
    expect(input("people")).toBeInTheDocument();
    expect(input("lanes")).toBeInTheDocument();
  });

  it("calls updateBookingDetails when changing Date", async () => {
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(input("when"), "2024-10-10");

    expect(mockFn).toHaveBeenCalled();
  });

  it("calls updateBookingDetails when changing Time", async () => {
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(input("time"), "10:30");

    expect(mockFn).toHaveBeenCalled();
  });

  it("calls updateBookingDetails when changing number of people", async () => {
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(input("people"), "3");

    expect(mockFn).toHaveBeenCalled();
  });

  it("calls updateBookingDetails when changing number of lanes", async () => {
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<BookingInfo updateBookingDetails={mockFn} />);

    await user.type(input("lanes"), "2");

    expect(mockFn).toHaveBeenCalled();
  });
});
