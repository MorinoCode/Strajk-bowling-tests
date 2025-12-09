import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";
import { vi } from "vitest";

describe("Input Component", () => {
  it("renders label and input", () => {
    // Kontrollerar grundläggande rendering av input-komponenten.
    render(<Input label="Test Label" type="text" name="test" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("passes defaultValue correctly", () => {
    // bekräftelse där data ska visas i input-fält.
    render(<Input label="Name" type="text" name="username" defaultValue="Mandus" />);
    expect(screen.getByLabelText("Name")).toHaveValue("Mandus");
  });

  it("calls handleChange on input change", () => {
    //  användaren kan mata in/ändra data (datum, tid, spelare, banor, skostorlek).
    const mockFn = vi.fn();
    render(<Input label="Email" type="text" name="email" handleChange={mockFn} />);

    // Använder getByLabelText
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a" } });

    expect(mockFn).toHaveBeenCalled();
  });

  it("applies custom class when provided", () => {
    //  Kontrollerar att anpassade CSS-klasser kan appliceras.
    render(
      <Input
        label="Age"
        type="number"
        name="age"
        customClass="custom-test"
      />
    );

    expect(screen.getByLabelText("Age")).toHaveClass("custom-test");
  });

  it("sets disabled attribute", () => {
    // G-kriteriet för bekräftelsevyn där input-fälten ska vara disabled.
    render(
      <Input
        label="Disabled"
        type="text"
        name="disabled"
        disabled={true}
      />
    );

    // Använder getByLabelText
    expect(screen.getByLabelText("Disabled")).toBeDisabled();
  });

  it("sets maxLength attribute", () => {
    // Kontrollerar att inmatningsbegränsningar fungerar.
    render(
      <Input
        label="Code"
        type="text"
        name="code"
        maxLength={5}
      />
    );

    expect(screen.getByLabelText("Code")).toHaveAttribute("maxLength", "5");
  });
  
});