import { Marker } from "react-leaflet";
import { useStore } from "@store";
import iconuser from "@assets/user-icon2.png";
import L from "leaflet";


const userIcon = new L.Icon({
  iconUrl: iconuser,
  iconSize: [30, 42], 
  iconAnchor: [15, 40], 
  popupAnchor: [0, -32],
  zIndex: 9999 
});

function MarkerMapClick() {
  const markerPosition = useStore((state) => state.markerPosition);
  

  if (!markerPosition) return null;

  return <Marker
    icon={userIcon}
    position={markerPosition} 
   />;
}

export default MarkerMapClick;
