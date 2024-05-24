import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "./LocationMarker";
import RadiusCircle from "./RadiusCircle";
import Routing from "./Routing";
import RoutingInputs from "./RoutingInputs";
import useMapClickHandler from "../../hook/useMapClickHandler";

const Map = ({ userLocation, radiusZone = 500, routingMode = false }) => {
  const { startPoint, endPoint, MapClickHandler } = useMapClickHandler();

  return (
    <section>
      {/* INPUT FORM RECORIDO */}
      {routingMode && <RoutingInputs />}
      <MapContainer
        center={[-34.67055556, -58.56277778]}
        zoom={15}
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
        {/* ROUTING PARA RECORIDO */}
        {routingMode && (
          <>
            <MapClickHandler />
            <Routing startPoint={startPoint} endPoint={endPoint} />
          </>
        )}
      </MapContainer>
    </section>
  );
};

export default Map;
