import React, { useState } from "react";
/* import { geocodeAddress } from "../../services/getGeoAdress"; */
import useMapClickHandler from "../../hook/useMapClickHandler";
import { useStore } from "../../store";

function RoutingInputs() {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const { startPoint, endPoint, setStartPoint, setEndPoint } =
    useMapClickHandler();

  const handleMapClick = (e) => {
    if (!startPoint) {
      setStartPoint(e.latlng);
    } else if (!endPoint) {
      setEndPoint(e.latlng);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  };

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
