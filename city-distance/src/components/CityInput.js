import React from "react";

const CityInput = ({ city, country, setCity, setCountry, label }) => {
  const baseId = label.toLowerCase().replace(/\s/g, "");

  return (
    <div className="city-input">
      <div>
        <label htmlFor={`${baseId}-city`}>{label}</label>
        <input
          id={`${baseId}-city`}
          data-testid={`${baseId}-city`}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ingrese ciudad"
        />
      </div>
      <div>
        <label htmlFor={`${baseId}-country`}>País</label>
        <input
          id={`${baseId}-country`}
          data-testid={`${baseId}-country`}
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Ingrese país"
        />
      </div>
    </div>
  );
};

export default CityInput;
