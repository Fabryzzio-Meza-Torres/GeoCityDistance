import React from "react";

const DistanceResult = ({ distance }) => {
  if (distance === null) return null;

  return (
    <div data-testid="distance-result">Distancia: {distance.toFixed(1)} km</div>
  );
};

export default DistanceResult;
