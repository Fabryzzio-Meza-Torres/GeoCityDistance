import React from "react";

export const MethodSelector = ({ method, setMethod }) => {
  return (
    <div>
      <h3>Select the method to obtain the distances</h3>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="csv">Read worldcities CSV</option>
        <option value="api">Use the API</option>
        <option value="mock">Fixed values (Mock)</option>
      </select>
    </div>
  );
};

export default MethodSelector;
