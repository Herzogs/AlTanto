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
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';


// dudas con esto. porque no usan el
import CategoryFilter, { categories } from '@components/Map/CategoryFilter';
import { useState, useEffect } from 'react';

const Map = ({
  userLocation,
  radiusZone = 500,
  routingMode = false,
  zoneMode = false,
  noDrag = false,
}) => {
  const { MapClickHandler } = useMapClickHandler();
  const { startPoint, endPoint, reports } = useStore();

  const [selectedCategories, setSelectedCategories] = useState([]);
  useEffect(() => {
    setSelectedCategories(categories.map(category => category.id));
  }, []);

  const filteredReports = (reports && reports.length > 0)
  ? reports.filter(report => selectedCategories.includes(report.categoryId))
  : [];


  return (


    <section className="h-100" style={{ position: "relative" }}>

      {/* Filtro de categorías */}
      <CategoryFilter selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />

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
        />

        <LocationMarker noDrag={noDrag} />
        {userLocation && !routingMode && (
          <RadiusCircle center={userLocation} radius={radiusZone} />
        )}

        {filteredReports && filteredReports.length > 0 ? (
          <MarkerClusterGroup>
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
              >
                <PopupAT report={report} />
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          <p>No reports available for the selected categories.</p>
        )}



        {/* ROUTING PARA RECORIDO */}
        {routingMode && (
          <>
            <MapClickHandler />
            <Routing startPoint={startPoint} endPoint={endPoint} numberPoints={6} />
          </>
        )}
      </MapContainer>
      {!zoneMode && !routingMode && <MenuButton />}
    </section>
  );
};

export default Map;
