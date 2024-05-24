import React, { useState } from "react";

function RoutingInputs() {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  const handleSetPoints = async () => {
    const startCoords = await geocodeAddress(startAddress);
    const endCoords = await geocodeAddress(endAddress);
    setStartPoint(startCoords);
    setEndPoint(endCoords);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter start address"
        value={startAddress}
        onChange={(e) => setStartAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter end address"
        value={endAddress}
        onChange={(e) => setEndAddress(e.target.value)}
      />
      <button onClick={handleSetPoints}>Setear puntos</button>
    </div>
  );
}

export default RoutingInputs;
