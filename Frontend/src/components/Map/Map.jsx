/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { icons, getIconByCategoryId } from "./Icons";
import LocationMarker from "@components/Map/LocationMarker";
import RadiusCircle from "@components/Map/RadiusCircle";
import Routing from "@components/road/Routing";
import PopupAT from "@components/Map/PopupAT";
import MenuButton from "@components/Map/MenuButton";
import useMapClickHandler from "@hook/useMapClickHandler";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { getCategoryFromApi } from "../../services/getCategory";
import { useEffect, useState } from "react";
import MarkerMapClick from "./MarkerMapClick";

import Filters from "@components/filter/Filters";
import { useStore, userStore } from "@store";

import "leaflet/dist/leaflet.css";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import "./styles.css";

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
  const [categories, setCategories] = useState([]);

  const { reports } = useStore();
  const { id } = userStore.getState().user;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategoryFromApi();
        setCategories(fetchedCategories);
        setSelectedCategories(fetchedCategories.map((category) => category.id));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const filteredReports =
    reports && reports.length > 0
      ? reports.filter((report) =>
          selectedCategories.includes(report.categoryId)
        )
      : [];

  const getIconByCategoryId = (categoryId) => {
    switch (categoryId) {
      case 1:
        return icons.category1;
      case 2:
        return icons.category2;
      case 3:
        return icons.category3;
      case 4:
        return icons.category4;
      default:
        return icons.default;
    }
  };

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

        {filteredReports && filteredReports.length > 0 && (
          <MarkerClusterGroup>
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={getIconByCategoryId(report.categoryId)}
              >
                <PopupAT report={report} />
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}

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