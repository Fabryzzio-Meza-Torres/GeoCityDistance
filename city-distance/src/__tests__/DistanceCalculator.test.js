// App.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

global.fetch = jest.fn();

describe("App Component - Distance Calculation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getInputs = () => ({
    city1Input: screen.getByTestId("ciudad1-city"),
    country1Input: screen.getByTestId("ciudad1-country"),
    city2Input: screen.getByTestId("ciudad2-city"),
    country2Input: screen.getByTestId("ciudad2-country"),
  });

  it("successfully calculates distance between two valid cities", async () => {
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                lat: -12.0464,
                lon: -77.0428,
                display_name: "Lima, Peru",
              },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                lat: 48.8566,
                lon: 2.3522,
                display_name: "Paris, France",
              },
            ]),
        })
      );

    render(<App />);

    const methodSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(methodSelect, "api");

    const { city1Input, country1Input, city2Input, country2Input } =
      getInputs();

    await userEvent.type(city1Input, "Lima");
    await userEvent.type(country1Input, "Peru");
    await userEvent.type(city2Input, "Paris");
    await userEvent.type(country2Input, "France");

    const calculateButton = screen.getByText("Calcular Distancia");
    await userEvent.click(calculateButton);

    await waitFor(() => {
      const distanceElement = screen.getByTestId("distance-result");
      expect(distanceElement).toHaveTextContent(/10254.5/);
    });
  });

  //Ciudad no existe
  it("handles non-existent city gracefully", async () => {
    global.fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                lat: -12.0464,
                lon: -77.0428,
                display_name: "Lima, Peru",
              },
            ]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve([]),
        })
      );

    render(<App />);

    const methodSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(methodSelect, "api");

    const { city1Input, country1Input, city2Input, country2Input } =
      getInputs();

    await userEvent.type(city1Input, "Lima");
    await userEvent.type(country1Input, "Peru");
    await userEvent.type(city2Input, "CiudadInexistente");
    await userEvent.type(country2Input, "PaísInexistente");

    const calculateButton = screen.getByText("Calcular Distancia");
    await userEvent.click(calculateButton);

    await waitFor(() => {
      const errorElement = screen.getByTestId("error-message");
      expect(errorElement).toBeInTheDocument();
    });
  });

  // Misma ciudad dos veces
  it("calculates zero distance when same city is entered twice", async () => {
    const limaCityResponse = Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            lat: -12.0464,
            lon: -77.0428,
            display_name: "Lima, Peru",
          },
        ]),
    });

    global.fetch
      .mockImplementationOnce(() => limaCityResponse)
      .mockImplementationOnce(() => limaCityResponse);

    render(<App />);

    const methodSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(methodSelect, "api");

    const { city1Input, country1Input, city2Input, country2Input } =
      getInputs();

    await userEvent.type(city1Input, "Lima");
    await userEvent.type(country1Input, "Peru");
    await userEvent.type(city2Input, "Lima");
    await userEvent.type(country2Input, "Peru");

    const calculateButton = screen.getByText("Calcular Distancia");
    await userEvent.click(calculateButton);

    await waitFor(() => {
      const distanceElement = screen.getByTestId("distance-result");
      expect(distanceElement).toHaveTextContent(/0/);
    });
  });

  it("handles API errors gracefully", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("API Error"))
    );

    render(<App />);

    const methodSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(methodSelect, "api");

    const { city1Input, country1Input } = getInputs();

    await userEvent.type(city1Input, "Lima");
    await userEvent.type(country1Input, "Peru");

    const calculateButton = screen.getByText("Calcular Distancia");
    await userEvent.click(calculateButton);

    await waitFor(() => {
      const errorElement = screen.getByTestId("error-message");
      expect(errorElement).toBeInTheDocument();
    });
  });
});
