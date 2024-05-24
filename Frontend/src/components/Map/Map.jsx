import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "./LocationMarker";
import RadiusCircle from "./RadiusCircle";
import Routing from "./Routing";
import RoutingInputs from "./RoutingInputs";

const Map = ({ userLocation, radiusZone = 500, routingMode = false }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

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



  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
        {userLocation && !routingMode && (
          <RadiusCircle center={userLocation} radius={radiusZone} />
        )}
        {routingMode && (
          <>
            <MapClickHandler />
            <Routing startPoint={startPoint} endPoint={endPoint} />
          </>
        )}
      </MapContainer>
      <RoutingInputs />
    </div>
  );
};

export default Map;
