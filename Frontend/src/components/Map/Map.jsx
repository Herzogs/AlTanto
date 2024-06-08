import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { icons, getIconByCategoryId } from './Icons';

import { useStore } from "@store";
import LocationMarker from "@components/Map/LocationMarker";
import RadiusCircle from "@components/Map/RadiusCircle";
import Routing from "@components/routs/Routing";
import PopupAT from "@components/Map/PopupAT";
import MenuButton from "@components/Map/MenuButton";
import useMapClickHandler from "@hook/useMapClickHandler";
import "leaflet/dist/leaflet.css";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { getCategoryFromApi } from "../../services/getCategory";
import { useEffect, useState } from "react";
import MarkerMapClick from "./MarkerMapClick";

const Map = ({
  userLocation,
  radiusZone = 500,
  routingMode = false,
  zoneMode = false,
  noDrag = false,
  startPoint = null,
  endPoint = null,
  fetchingReport = false,
  CategoryFilterComponent = null,
  mapClick = false,
  noCircle = false,
}) => {

  const { MapClickHandler } = useMapClickHandler();
  const { reports } = useStore();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

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
    <section className="h-100" style={{ position: "relative" }}>
      {CategoryFilterComponent && (
        <CategoryFilterComponent
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
      )}

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

        {mapClick && (
          <>
            <MapClickHandler />
            <MarkerMapClick />
          </>
        )}

        <LocationMarker noDrag={noDrag} />
        {!noCircle && userLocation && !routingMode && (
          <RadiusCircle center={userLocation} radius={radiusZone} noCircle={noCircle} />
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
      {!zoneMode && !routingMode && <MenuButton />}
    </section>
  );
};

export default Map;
