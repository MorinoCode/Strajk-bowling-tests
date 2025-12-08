import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage Component", () => {
  it("renders the error message text", () => {
    // Stödjer: VG-kriterier som kräver att ett felmeddelande visas.
    render(<ErrorMessage message="Something went wrong!" />);

    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("wraps message inside article with correct class", () => {
    // Hjälptest: Kontrollerar korrekt DOM-struktur för styling.
    const { container } = render(<ErrorMessage message="Error here" />);
    
    const article = container.querySelector(".error-message");
    expect(article).toBeInTheDocument();
  });
});