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

      const inputs = screen.getAllByDisplayValue("");

      date = inputs.find((el) => el.type === "date");
      time = inputs.find((el) => el.type === "time");
      people = inputs.find((el) => el.name === "people");
      lanes = inputs.find((el) => el.name === "lanes");

      button = screen.getByRole("button", { name: "strIIIIIike!" });
    });

    it("shows error if Date is empty", async () => {
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if Time is empty", async () => {
      await user.type(date, "2024-10-10");
      await user.type(people, "2");
      await user.type(lanes, "1");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if People is empty", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(lanes, "1");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if Lanes is empty", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");

      await user.click(button);

      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if amount of shoes is not equal to pepole", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);

      let shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      const shoeInput = shoeInputs[0];
      await user.type(shoeInput, "1");

      await user.click(button);

      expect(
        await screen.findByText(
          "Antalet skor måste stämma överens med antal spelare"
        )
      ).toBeInTheDocument();
    });

    it("shows error if all shoes input are not filled", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);
      await userEvent.click(shoesAddButtonElement);

      let shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      const shoeInput = shoeInputs[0];
      await user.type(shoeInput, "44");

      await user.click(button);

      expect(
        await screen.findByText("Alla skor måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error if amount of pepole are more that 4 for each lane", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "5");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);
      await user.click(shoesAddButtonElement);

      let shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      for (const shoeInput of shoeInputs) {
        await user.type(shoeInput, "44");
      }

      await user.click(button);

      expect(
        await screen.findByText("Det får max vara 4 spelare per bana")
      ).toBeInTheDocument();
    });

    it("does not show any error when all fields are correctly filled", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });

      await user.click(shoesAddButtonElement)
      await user.click(shoesAddButtonElement)

      let shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      for (const shoeInput of shoeInputs) {
        await user.type(shoeInput, "44");
      }

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
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);

      const shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));
      expect(shoeInputs[0]).toBeInTheDocument();
    });

    it("should delete a input for shoes when delete button is clicked", async () => {
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);

      let shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));
      expect(shoeInputs[0]).toBeInTheDocument();

      const shoesDeleteButtonElement = screen.getByRole("button", {
        name: "-",
      });
      await userEvent.click(shoesDeleteButtonElement);

      shoeInputs = screen
        .queryAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      expect(shoeInputs.length).toBe(0);
    });

    it("should delete the second input for shoes when  it's delete button is clicked", async () => {
      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const shoesAddButtonElement = screen.getByRole("button", { name: "+" });
      await userEvent.click(shoesAddButtonElement);
      await userEvent.click(shoesAddButtonElement);

      let shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));
      expect(shoeInputs.length).toBe(2);

      const shoesDeleteButtonElement = screen.getAllByRole("button", {
        name: "-",
      });
      await userEvent.click(shoesDeleteButtonElement[1]);

      shoeInputs = screen
        .queryAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      expect(shoeInputs.length).toBe(1);
      expect(shoeInputs[0]).toBeInTheDocument();
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

      const inputs = screen.getAllByDisplayValue("");

      date = inputs.find((el) => el.type === "date");
      time = inputs.find((el) => el.type === "time");
      people = inputs.find((el) => el.name === "people");
      lanes = inputs.find((el) => el.name === "lanes");

      button = screen.getAllByRole("button", { name: "strIIIIIike!" })[0];
    });

    it("should submit booking, save confirmation and navigate", async () => {
      await user.type(date, "2024-10-10");
      await user.type(time, "19:30");
      await user.type(people, "2");
      await user.type(lanes, "1");

      const addButtons = screen.getByRole("button", { name: "+" });
      await user.click(addButtons);
      await user.click(addButtons);

      const shoeInputs = screen
        .getAllByRole("textbox")
        .filter((el) => el.classList.contains("shoes__input"));

      await user.type(shoeInputs[0], "44");
      await user.type(shoeInputs[1], "43");

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
