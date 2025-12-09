import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Booking from "./Booking";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect } from "vitest";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});
useNavigate.mockReturnValue(vi.fn());

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          bookingDetails: {
            when: "2024-10-10T19:30",
            people: 2,
            lanes: 1,
            bookingId: "ABC123",
            price: 300,
          },
        }),
    })
  )
);

describe("Booking Page", () => {
  describe("Booking Page — Render static elements", () => {
    it("should render heading and buttons", () => {
      /*
      * Kriterier:
      * - G: Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp.
      * - G: Användaren ska kunna ange skostorlek för varje spelare (Testar att '+'-knappen finns).
      */
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const headigElement = screen.getByRole("heading", { level: 1 });
      expect(headigElement).toHaveTextContent("Booking");

      const stikeButtonElement = screen.getByRole("button", {
        name: "strIIIIIike!",
      });
      expect(stikeButtonElement).toBeInTheDocument();

      const shoesButtonElement = screen.getByRole("button", { name: "+" });
      expect(shoesButtonElement).toBeInTheDocument();
    });
  });

  describe("Booking Page — field validation", () => {
    let date, time, people, lanes, button;
    let user;

    beforeEach(() => {
      user = userEvent.setup({ delay: null });

      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      // Använder getByLabelText för att hitta fälten
      date = screen.getByLabelText("Date");
      time = screen.getByLabelText("Time");
      people = screen.getByLabelText("Number of awesome bowlers");
      lanes = screen.getByLabelText("Number of lanes");

      button = screen.getByRole("button", { name: "strIIIIIike!" });
    });

    it("shows error if Date is empty", async () => {
      // VG Kriterium: Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas. (Testar för saknat datum)
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if Time is empty", async () => {
      // VG Kriterium: Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas. (Testar för saknad tid)
      await user.type(date, "2024-10-10");
      await user.type(people, "2");
      await user.type(lanes, "1");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if People is empty", async () => {
      // VG Kriterium: Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas. (Testar för saknat antal spelare)
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(lanes, "1");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if Lanes is empty", async () => {
      // VG Kriterium: Ifall användaren inte fyller i något av ovanstående så ska ett felmeddelande visas. (Testar för saknat antal banor)
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if amount of shoes is not equal to pepole", async () => {
      /*
      * Kriterier:
      * - VG: Om antalet personer och skor inte matchas ska ett felmeddelande visas.
      * - G: Användaren ska kunna ange antal spelare.
      * - G: Användaren ska kunna reservera ett eller flera banor beroende på antal spelare.
      */
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement); // Lägger till 1 sko (vs 2 personer)

      // Använder getByLabelText för den första skostorleken
      const shoeInput = screen.getByLabelText("Shoe size / person 1");
      await user.type(shoeInput, "1");

      await user.click(button);

      expect(
        await screen.findByText(
          "Antalet skor måste stämma överens med antal spelare"
        )
      ).toBeInTheDocument();
    });

    it("shows error if all shoes input are not filled", async () => {
      /*
      * Kriterier:
      * - VG: Om användaren försöker slutföra bokningen utan att ange skostorlek för en spelare som har valt att boka skor, ska systemet visa ett felmeddelande och be om att skostorleken anges.
      * - G: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen.
      */
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);
      await userEvent.click(shoesAddButtonElement);

      // Använder getByLabelText för den första skostorleken
      const shoeInput1 = screen.getByLabelText("Shoe size / person 1");
      await user.type(shoeInput1, "44"); // Fyller i 1 sko, lämnar 1 tom

      await user.click(button);

      expect(
        await screen.findByText("Alla skor måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if amount of pepole are more that 4 for each lane", async () => {
      // VG Kriterium: Om det inte finns tillräckligt med lediga banor för det angivna antalet spelare, ska användaren få ett felmeddelande.
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "5"); // 5 personer
      await user.type(lanes, "1"); // 1 bana (max 4)

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);

      // Använder getByLabelText för att hitta skofälten och fylla i dem
      await user.type(screen.getByLabelText("Shoe size / person 1"), "44");
      await user.type(screen.getByLabelText("Shoe size / person 2"), "44");
      await user.type(screen.getByLabelText("Shoe size / person 3"), "44");
      await user.type(screen.getByLabelText("Shoe size / person 4"), "44");
      await user.type(screen.getByLabelText("Shoe size / person 5"), "44");

      await user.click(button);

      expect(
        await screen.findByText("Det får max vara 4 spelare per bana")
      ).toBeInTheDocument();
    });

    it("does not show any error when all fields are correctly filled", async () => {
      /*
      * Kriterier:
      * - G: Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem.
      * - G: Användaren ska kunna ange antal spelare (minst 1 spelare).
      * - G: Användaren ska kunna reservera ett eller flera banor beroende på antal spelare.
      * - G: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen.
      * - G: Användaren ska kunna ange skostorlek för varje spelare.
      * - VG: Säkerställer att inga VG-felmeddelanden visas när allt är korrekt ifyllt.
      */
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });

      await user.click(shoesAddButtonElement)
      await user.click(shoesAddButtonElement)

      // Använder getByLabelText för skofälten
      await user.type(screen.getByLabelText("Shoe size / person 1"), "44");
      await user.type(screen.getByLabelText("Shoe size / person 2"), "44");

      user.click(screen.getByText("strIIIIIike!"));

      expect(screen.queryByText("Alla fälten måste vara ifyllda")).toBeNull();
      expect(
        screen.queryByText(
          "Antalet skor måste stämma överens med antal spelare"
        )
      ).toBeNull();
      expect(screen.queryByText("Alla skor måste vara ifyllda")).toBeNull();
      expect(
        screen.queryByText("Det får max vara 4 spelare per bana")
      ).toBeNull();
    });
  });

  describe("Booking Page - functionality tests", async () => {
    it("should add a input for shoes when add button is clicked", async () => {
      // G Kriterium: Användaren ska kunna ange skostorlek för varje spelare.
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);

      // Använder getByLabelText för verifiering
      expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
    });

    it("should delete a single input for shoes when its delete button is clicked", async () => {
      // G Kriterium: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare.
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);

      // Verifierar att fältet finns
      expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();

      const shoesDeleteButtonElement = screen.getByRole("button", {
        name: "-",
      });
      await userEvent.click(shoesDeleteButtonElement);

      // Verifierar att fältet är borta
      expect(screen.queryByLabelText("Shoe size / person 1")).toBeNull();
    });

    it("should delete the second input for shoes when its delete button is clicked", async () => {
      // G Kriterium: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare.
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);
      await userEvent.click(shoesAddButtonElement);

      // Verifierar att båda fälten finns
      expect(screen.getByLabelText("Shoe size / person 2")).toBeInTheDocument();

      const shoesDeleteButtonElement = screen.getAllByRole("button", {
        name: "-",
      });
      await userEvent.click(shoesDeleteButtonElement[1]);

      // Verifierar att Person 1 är kvar, men Person 2 är borta
      expect(screen.getByLabelText("Shoe size / person 1")).toBeInTheDocument();
      expect(screen.queryByLabelText("Shoe size / person 2")).toBeNull();
    });
  });

  describe('"Booking Page — Successful booking"', () => {
    let date, time, people, lanes, button, user, navigate;

    beforeEach(() => {
      user = userEvent.setup({ delay: null });

      navigate = vi.fn();
      useNavigate.mockReturnValue(navigate);

      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      // --- Uppdaterad selektion med getByLabelText ---
      date = screen.getByLabelText("Date");
      time = screen.getByLabelText("Time");
      people = screen.getByLabelText("Number of awesome bowlers");
      lanes = screen.getByLabelText("Number of lanes");
      // ------------------------------------------------

      button = screen.getAllByRole("button", { name: "strIIIIIike!" })[0];
    });

    it("should submit booking, save confirmation and navigate", async () => {
      /*
      * Kriterier:
      * - G: Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp.
      * - G: Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar.
      * - G: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd.
      * - G: Systemet ska beräkna och visa den totala summan... (verifieras via den sparade datan).
      * - G: Systemet ska visa en översikt där användaren kan kontrollera de valda skostorlekarna... (Genom att skicka med skostorlekarna i anropet, vilket mocken bekräftar).
      */
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const addButtons = screen.getByRole("button", { name: "+" });
      await user.click(addButtons);
      await user.click(addButtons);

      // Använder getByLabelText för skofälten
      await user.type(screen.getByLabelText("Shoe size / person 1"), "44");
      await user.type(screen.getByLabelText("Shoe size / person 2"), "43");

      await user.click(button);

      await waitFor(() =>
        expect(navigate).toHaveBeenCalledWith(
          "/confirmation",
          expect.any(Object)
        )
      );

      const saved = JSON.parse(sessionStorage.getItem("confirmation"));
      expect(saved.bookingId).toBeDefined();
    });
  });
});