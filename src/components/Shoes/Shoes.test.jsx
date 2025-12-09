import { render, screen, fireEvent } from "@testing-library/react";
import Shoes from "./Shoes";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("Shoes Component", () => {
  const mockUpdateSize = vi.fn();
  const mockAddShoe = vi.fn();
  const mockRemoveShoe = vi.fn();

  const mockShoes = [
    { id: "a1", size: "42" },
    { id: "b2", size: "44" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading 'Shoes'", () => {
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Shoes");
  });

  it("renders shoe input fields for each shoe", () => {
    /*
    * Kriterier:
    * - G: Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna för varje spelare innan bokningen slutförs.
    */
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    expect(screen.getByText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByText("Shoe size / person 2")).toBeInTheDocument();

    expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(2);
  });

  it("calls addShoe when + button is clicked", () => {
    // G Kriterium: Användaren ska kunna ange skostorlek för varje spelare. (Testar att lägga till ett skofält).
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    fireEvent.click(screen.getByText("+"));

    expect(mockAddShoe).toHaveBeenCalledTimes(1);
  });

  it("calls removeShoe when - button is clicked", () => {
    // G Kriterium: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare.
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={mockShoes}
      />
    );

    const deleteButtons = screen.getAllByText("-");
    fireEvent.click(deleteButtons[0]);

    expect(mockRemoveShoe).toHaveBeenCalledTimes(1);
    expect(mockRemoveShoe).toHaveBeenCalledWith("a1");
  });

  it("calls updateSize when typing in a shoe input", () => {
    /*
    * Kriterier:
    * - G: Användaren ska kunna ange skostorlek för varje spelare.
    * - G: Användaren ska kunna ändra skostorlek för varje spelare.
    */
    render(
      <Shoes
        updateSize={mockUpdateSize}
        addShoe={mockAddShoe}
        removeShoe={mockRemoveShoe}
        shoes={[{ id: "abc", size: "" }]}
      />
    );

    const input = screen.getByLabelText("Shoe size / person 1");

    fireEvent.change(input, { target: { name: "abc", value: "41" } });

    expect(mockUpdateSize).toHaveBeenCalledTimes(1);
  });

});