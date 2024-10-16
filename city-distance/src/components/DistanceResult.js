import React from "react";

export const DistanceResult = ({ distance }) => {
  return (
    <div>
      {distance !== null ? <h2>Distancia:{distance.toFixed(2)} km</h2> : null}
    </div>
  );
};

export default DistanceResult;
