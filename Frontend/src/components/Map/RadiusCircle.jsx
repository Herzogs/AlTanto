import { Circle } from "react-leaflet";

const RadiusCircle = ({ center, radius }) => {
  return <Circle 
    center={center} 
    radius={radius} 
    pathOptions={{ color: "#FD7014", fillColor: "#FD7014"}}
  />;
};

export default RadiusCircle;
