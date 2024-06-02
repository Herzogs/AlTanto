import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useStore } from "@store";
import LocationMarker from "@components/Map/LocationMarker";
import RadiusCircle from "@components/Map/RadiusCircle";
import Routing from "@components/routs/Routing";
import RoutingInputs from "@components/routs/RoutingInputs";
import PopupAT from "@components/Map/PopupAT";
import MenuButton from "@components/Map/MenuButton";
import useMapClickHandler from "@hook/useMapClickHandler";
import "leaflet/dist/leaflet.css";

const Map = ({
  userLocation,
  radiusZone = 500,
  routingMode = false,
  zoneMode = false,
  noDrag = false,
}) => {
  const { MapClickHandler } = useMapClickHandler();
  const { startPoint, endPoint, reports } = useStore();

  return (
    <section className="h-100" style={{ position: "relative"}}> 
      {/* INPUT FORM RECORIDO */}
      {routingMode && <RoutingInputs />}
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [0, 0]}
        zoom={15}
        minZoom={12}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
         url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
         attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
         /* url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>' */
        />
        <LocationMarker noDrag={noDrag} />
        {userLocation && !routingMode && (
          <RadiusCircle center={userLocation} radius={radiusZone} />
        )}
        {!zoneMode &&
          !routingMode &&
          reports &&
          reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
            >
              <PopupAT report={report} />
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
      {!zoneMode && <MenuButton />}
    </section>
  );
};

export default Map;
