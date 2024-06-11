/* eslint-disable react/prop-types */
import { Circle } from "react-leaflet";

const RadiusCircle = ({ center, radius }) => {
  return <Circle 
    center={center} 
    radius={radius} 
    pathOptions={{ color: "#FD7014", fillColor: "#ffc49d"}}
  />;
};

export default RadiusCircle;
