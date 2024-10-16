import React from "react";

const CityInput = ({ city, setCity, country, setCountry, label }) => {
  return (
    <div>
      <h3>{label}</h3>
      <input
        type="text"
        placeholder="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
    </div>
  );
};

export default CityInput;
