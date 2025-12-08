import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Confirmation from "./Confirmation";

describe("Confirmation Page", () => {

  describe("Confirmation Page — Render static elements", () => {

    it("should render heading", async () => {
      // Hjälptest: Kontrollerar att vyns titel renderas korrekt.
      render(
        <MemoryRouter>
          <Confirmation />
        </MemoryRouter>
      );

      const headingElement = screen.getByRole("heading", { level: 1 });
      expect(headingElement).toHaveTextContent("See you soon!");
    });

    it("should not render inputs, total price and confirm button if there is not a confirmation key in session storage", async () => {
      // G Kriterium: Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten "Inga bokning gjord visas".
      render(
        <MemoryRouter>
          <Confirmation />
        </MemoryRouter>
      );

      expect(
        screen.queryByDisplayValue("2024-10-10 10:30")
      ).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("2")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("3")).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("XYZ999")).not.toBeInTheDocument();

      const price = screen.queryByText("560 sek");
      expect(price).not.toBeInTheDocument();
      const confirmButton = screen.queryByRole("button", {
        name: "Sweet, let's go!",
      });
      expect(confirmButton).not.toBeInTheDocument();

      expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
    });

    it("should render inputs, total price and confirm button if there is a confirmation key in session storage", async () => {
      /*
      * Kriterier:
      * - G: Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas.
      * - G: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd.
      * - G: Systemet ska beräkna och visa den totala summan...
      * - G: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor.
      */
      sessionStorage.setItem(
        "confirmation",
        JSON.stringify({
          when: "2024-10-10T10:30",
          lanes: 2,
          people: 3,
          price: 560,
          bookingId: "XYZ999",
        })
      );
      render(
        <MemoryRouter>
          <Confirmation />
        </MemoryRouter>
      );

      expect(screen.getByDisplayValue("2024-10-10 10:30")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("3")).toBeInTheDocument();
      expect(screen.getByDisplayValue("XYZ999")).toBeInTheDocument();

      const price = screen.getByText("560 sek");
      expect(price).toBeInTheDocument();
      const confirmButton = screen.getByRole("button", {
        name: "Sweet, let's go!",
      });
      expect(confirmButton).toBeInTheDocument();
    });

  });
});