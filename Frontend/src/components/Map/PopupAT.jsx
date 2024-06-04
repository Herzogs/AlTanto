import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Popup } from "react-leaflet";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

function PopupAT({ report }) {
  return (
    <Popup className="at-popup">
      <h5>{report.categoryName}</h5>
      <p>{report.content}</p>
      <Link className="me-4" to={`/reportes/${report.id}`}>
        Ver detalle
      </Link>
      <IconButton>
        <ThumbUpIcon style={{ color: "#537ac9" }} />
      </IconButton>
      <IconButton>
        <ThumbDownAltIcon style={{ color: "#cc545d" }} />
      </IconButton>
    </Popup>
  );
}

export default PopupAT;
