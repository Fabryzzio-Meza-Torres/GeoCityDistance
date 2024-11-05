import React, { useState } from "react";
import "./App.css";
import CityInput from "./components/CityInput";
import DistanceResult from "./components/DistanceResult";
import MethodSelector from "./components/MethodSelector";

//Haversine formula
const haversineDistance = (coords1, coords2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lon - coords1.lon) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1.lat * (Math.PI / 180)) *
      Math.cos(coords2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
const fetchCoordinates = async (city, country, method) => {
  switch (method) {
    case "api":
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city},${country}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      } else {
        throw new Error("City not found in API");
      }

    case "mock":
      const mockCities = {
        lima: { lat: -12.0463731, lon: -77.042754 },
        tokyo: { lat: 35.6895, lon: 139.6917 },
        newyork: { lat: 40.7128, lon: -74.006 },
        paris: { lat: 48.8566, lon: 2.3522 },
        sydney: { lat: -33.8688, lon: 151.2093 },
        mumbai: { lat: 19.076, lon: 72.8777 },
        buenosaires: { lat: -34.6037, lon: -58.3816 },
      };

      const normalizedCity = city.toLowerCase().replace(/\s/g, "").trim();

      if (mockCities[normalizedCity]) {
        return mockCities[normalizedCity];
      } else {
        throw new Error("City not found in mock data");
      }

    case "csv":
      try {
        const loadCSV = async () => {
          const response = await fetch("/worldcities.csv");
          if (!response.ok) {
            throw new Error(`Error loading CSV file: ${response.statusText}`);
          }
          return response.text();
        };

        const parseCSV = (csvText) => {
          const rows = csvText.split("\n").slice(1);
          if (!rows.length) {
            throw new Error("No data found in the CSV file.");
          }
          return rows.map((row) => {
            const [city, city_ascii, lat, lng] = row
              .split(",")
              .map((col) => col.replace(/"/g, "").trim());
            return {
              city,
              city_ascii,
              lat: parseFloat(lat),
              lon: parseFloat(lng),
            };
          });
        };

        const findCity = (cities, city) => {
          const normalizedCity = city.toLowerCase().trim();
          return cities.find(
            (cityData) => cityData.city.toLowerCase().trim() === normalizedCity
          );
        };

        const csvText = await loadCSV();
        const cities = parseCSV(csvText);
        console.log("Cities Loaded:", cities.length);
        const cityData = findCity(cities, city);

        if (cityData) {
          console.log("City Found:", cityData);
          return { lat: cityData.lat, lon: cityData.lon };
        } else {
          throw new Error(`City not found in CSV:" ${city}`);
        }
      } catch (error) {
        console.error("Error processing CSV".error);
        throw error;
      }
    default:
      throw new Error("Invalid method");
  }
};

function App() {
  const [city1, setCity1] = useState("");
  const [country1, setCountry1] = useState("");
  const [city2, setCity2] = useState("");
  const [country2, setCountry2] = useState("");
  const [method, setMethod] = useState("api");
  const [distance, setDistance] = useState(null);

  const calculateDistance = async (e) => {
    e.preventDefault();
    try {
      const coords1 = await fetchCoordinates(city1, country1, method);
      const coords2 = await fetchCoordinates(city2, country2, method);
      const distance = haversineDistance(coords1, coords2);
      setDistance(distance);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>City Distance Calculator</h1>
      <CityInput
        city={city1}
        country={country1}
        setCity={setCity1}
        setCountry={setCountry1}
        label="Ciudad 1"
      />
      <CityInput
        city={city2}
        country={country2}
        setCity={setCity2}
        setCountry={setCountry2}
        label="Ciudad 2"
      />
      <MethodSelector method={method} setMethod={setMethod} />

      <button onClick={calculateDistance}>Calcular Distancia</button>
      <DistanceResult distance={distance} />
    </div>
  );
}

export default App;
