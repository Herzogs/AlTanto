import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import RadiusCircle from './RadiusCircle';
import Routing from './Routing';

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [routingMode, setRoutingMode] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');

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
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
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
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker userLocation={userLocation} setUserLocation={setUserLocation} />
        {userLocation && !routingMode && <RadiusCircle center={userLocation} radius={500} />}
        {routingMode && (
          <>
            <MapClickHandler />
            <Routing startPoint={startPoint} endPoint={endPoint} />
          </>
        )}
      </MapContainer>
      <div>
        <button onClick={() => {
          setRoutingMode(!routingMode);
          setStartPoint(null);
          setEndPoint(null);
        }}>
          {routingMode ? "Cancel Routing" : "Start Routing"}
        </button>
      </div>
      {routingMode && (
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
          <button onClick={handleSetPoints}>Set Points</button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
