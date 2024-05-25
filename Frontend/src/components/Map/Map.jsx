import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useStore } from "../../store";
import LocationMarker from "./LocationMarker";
import RadiusCircle from "./RadiusCircle";
import Routing from "../routs/Routing";
import RoutingInputs from "../routs/RoutingInputs";
import MenuButton from "./MenuButton";
import useMapClickHandler from "../../hook/useMapClickHandler";
import "leaflet/dist/leaflet.css";

const Map = ({ userLocation, radiusZone = 500, routingMode = false }) => {
  const { MapClickHandler } = useMapClickHandler();
  const { startPoint, endPoint, reports } = useStore();

  return (
    <section>
      {/* INPUT FORM RECORIDO */}
      {routingMode && <RoutingInputs />}
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [0, 0]}
        zoom={15}
        minZoom={12}
        maxZoom={20}
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
        {!routingMode &&
          reports &&
          reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
            >
              <Popup>
                <strong>{report.title}</strong>
                <br />
                {report.content}
              </Popup>
            </Marker>
          ))}
        {/* ROUTING PARA RECORIDO */}
        {routingMode && (
          <>
            <MapClickHandler />
            <Routing startPoint={startPoint} endPoint={endPoint} />
          </>
        )}
      </MapContainer>
      <MenuButton />
    </section>
  );
};

export default Map;
