import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useStore } from "@store";
import LocationMarker from "@components/Map/LocationMarker";
import RadiusCircle from "@components/Map/RadiusCircle";
import Routing from "@components/routs/Routing";
import RoutingInputs from "@components/routs/RoutingInputs";
import MenuButton from "@components/Map/MenuButton";
import useMapClickHandler from "@hook/useMapClickHandler";
import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/dist/styles.min.css';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';


const Map = ({ userLocation, radiusZone = 500, routingMode = false, zoneMode = false, noDrag = false }) => {

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
        <LocationMarker noDrag={noDrag} />
        {userLocation && !routingMode && (
          <RadiusCircle center={userLocation} radius={radiusZone} />
        )}
        {!zoneMode && (
          <MarkerClusterGroup showCoverageOnHover={false}>
            {reports &&
              reports.map((report) => (
                <Marker
                  key={report._id}
                  position={[report.latitude, report.longitude]}
                >
                  <Popup>
                    <strong>{report.title}</strong>
                    <br />
                    {report.content}
                  </Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>)
        }

        {/* ROUTING PARA RECORIDO */}
        {routingMode && (
          <>
            <MapClickHandler />
            <Routing startPoint={startPoint} endPoint={endPoint} numberPoints={6} />
          </>
        )}
      </MapContainer>
      {!zoneMode && !routingMode && (<MenuButton />)}
    </section>
  );
};

export default Map;
