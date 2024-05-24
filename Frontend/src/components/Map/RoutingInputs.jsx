import React, { useState } from "react";
import useMapClickHandler from "../../hook/useMapClickHandler";
import { geocodeAddress } from "../../services/getGeoAdress";

function RoutingInputs() {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const { setStartPoint, setEndPoint } = useMapClickHandler();

  const handleSetPoints = async () => {
    const startCoords = await geocodeAddress(startAddress);
    const endCoords = await geocodeAddress(endAddress);
    setStartPoint(startCoords);
    setEndPoint(endCoords);
  };

  return (
    <article className="my-3">
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
    </article>
  );
}

export default RoutingInputs;
