import { Marker, Popup } from "react-leaflet";
import { useStore } from "@store";
import { Link } from "react-router-dom";
import iconMarker from "@assets/user-icon2.png";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: iconMarker,
  iconSize: [30, 46],
  iconAnchor: [13, 40],
  popupAnchor: [0, -32],
  zIndex: 9999,
});

function MarkerMapClick() {
  const markerPosition = useStore((state) => state.markerPosition);
  if (!markerPosition) return null;

  return (
    <Marker icon={userIcon} position={markerPosition}>
      <Popup>
        <div className="marker-report">
          <Link to="/form/reporte" className="mb-2">
            Reporte Manual
          </Link>
          <Link to="/form/reporte/automatico"> Reporte Automático </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default MarkerMapClick;
