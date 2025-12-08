import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  it("renders label and input", () => {
    // Hjälptest: Kontrollerar grundläggande rendering av input-komponenten.
    render(<Input label="Test Label" type="text" name="test" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("passes defaultValue correctly", () => {
    // Stödjer: G-kriteriet för översikt/bekräftelse där data ska visas i input-fält.
    render(<Input label="Name" type="text" name="username" defaultValue="Mandus" />);
    expect(screen.getByRole("textbox")).toHaveValue("Mandus");
  });

  it("calls handleChange on input change", () => {
    // Stödjer: Alla G-kriterier som involverar att användaren kan mata in/ändra data (datum, tid, spelare, banor, skostorlek).
    const mockFn = vi.fn();
    render(<Input label="Email" type="text" name="email" handleChange={mockFn} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });

    expect(mockFn).toHaveBeenCalled();
  });

  it("applies custom class when provided", () => {
    // Hjälptest: Kontrollerar att anpassade CSS-klasser kan appliceras.
    render(
      <Input
        label="Age"
        type="number"
        name="age"
        customClass="custom-test"
      />
    );

    expect(screen.getByRole("spinbutton")).toHaveClass("custom-test");
  });

  it("sets disabled attribute", () => {
    // Stödjer: G-kriteriet för bekräftelsevyn där input-fälten ska vara disabled.
    render(
      <Input
        label="Disabled"
        type="text"
        name="disabled"
        disabled={true}
      />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("sets maxLength attribute", () => {
    // Hjälptest: Kontrollerar att inmatningsbegränsningar fungerar.
    render(
      <Input
        label="Code"
        type="text"
        name="code"
        maxLength={5}
      />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "5");
  });
  
});