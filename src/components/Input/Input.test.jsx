import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  it("renders label and input", () => {
    render(<Input label="Test Label" type="text" name="test" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("passes defaultValue correctly", () => {
    render(<Input label="Name" type="text" name="username" defaultValue="Mandus" />);
    expect(screen.getByRole("textbox")).toHaveValue("Mandus");
  });

  it("calls handleChange on input change", () => {
    const mockFn = vi.fn();
    render(<Input label="Email" type="text" name="email" handleChange={mockFn} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });

    expect(mockFn).toHaveBeenCalled();
  });

  it("applies custom class when provided", () => {
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
