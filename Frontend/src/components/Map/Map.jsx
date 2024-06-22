/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MapContainer, TileLayer} from "react-leaflet";
import LocationMarker from "@components/Map/LocationMarker";
import RadiusCircle from "@components/Map/RadiusCircle";
import Routing from "@components/road/Routing";
import MenuButton from "@components/Map/MenuButton";
import useMapClickHandler from "@hook/useMapClickHandler";
import { getCategoryFromApi } from "@/services/getCategory";
import { useEffect, useState } from "react";
import MarkerMapClick from "./MarkerMapClick";
import Filters from "@components/filter/Filters";
import { userStore } from "@store";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import MapReport from "@components/Map/MapReport";

const Map = ({
  userLocation,
  radiusZone = 500,
  routingMode = false,
  zoneMode = false,
  startPoint = null,
  endPoint = null,
  showFilters = false,
  mapClick = false,
  noCircle = false,
}) => {
  const { MapClickHandler } = useMapClickHandler();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { id } = userStore.getState().user;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoryFromApi();
        setSelectedCategories(fetchedCategories.map((category) => category.id));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="altanto-map">
      {showFilters && (
        <Filters
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      )}

      <MapContainer
        className="w-100 h-100"
        center={userLocation ? [userLocation.lat, userLocation.lng] : [0, 0]}
        zoom={15}
        minZoom={14}
        maxZoom={18}
        markerZoomAnimation={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {id && mapClick && (
          <>
            <MapClickHandler />
            <MarkerMapClick />
          </>
        )}

        <LocationMarker />
        {!noCircle && userLocation && !routingMode && (
          <RadiusCircle
            center={userLocation}
            radius={radiusZone}
            noCircle={noCircle}
          />
        )}

        <MapReport selectedCategories={selectedCategories} />
        {/* ROUTING PARA RECORIDO */}
        {routingMode && startPoint && endPoint && (
          <Routing startPoint={startPoint} endPoint={endPoint} />
        )}
      </MapContainer>
      {id && !zoneMode && !routingMode && <MenuButton />}
    </section>
  );
};

export default Map;