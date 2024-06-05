import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useStore } from "@store";
import LocationMarker from "@components/Map/LocationMarker";
import RadiusCircle from "@components/Map/RadiusCircle";
import Routing from "@components/routs/Routing";
import PopupAT from "@components/Map/PopupAT";
import MenuButton from "@components/Map/MenuButton";
import useMapClickHandler from "@hook/useMapClickHandler";
import "leaflet/dist/leaflet.css";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';


const Map = ({
  userLocation,
  radiusZone = 500,
  routingMode = false,
  zoneMode = false,
  noDrag = false,
  startPoint = null,
  endPoint = null,
  fetchingReport = false,
}) => {


  
  const { MapClickHandler } = useMapClickHandler();
  
  const { reports } = useStore();


  return (
    <section className="h-100" style={{ position: "relative"}}> 

     
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
        />
        <LocationMarker noDrag={noDrag} />
        {userLocation && !routingMode && (
          <RadiusCircle center={userLocation} radius={radiusZone} />
        )}
        {reports && (
          <MarkerClusterGroup>
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
              >
                <PopupAT report={report} />
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
        {/* ROUTING PARA RECORIDO */}
        {routingMode && startPoint && endPoint && (
          <>
            {/*<MapClickHandler />*/}
            <Routing startPoint={startPoint} endPoint={endPoint} />
          </>
        )}
      </MapContainer>
      {!zoneMode && !routingMode && <MenuButton />}
    </section>
  );
};

export default Map;
