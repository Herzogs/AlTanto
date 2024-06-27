/* eslint-disable react/prop-types */
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Popup } from "react-leaflet";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { updateScoring } from "@services/sendData";

function PopupAT({ report }) {
  const { createAt, categoryName, content, id, positiveScore, negativeScore } = report;

  const formattedDate = format(new Date(createAt), "HH:mm - dd/MM/yyyy");


  return (
    <Popup className="at-popup">
      <h6 className="fw-bold">{categoryName}</h6>
      <p className="my-2">{content}</p>
      <p className="my-2">{formattedDate}</p>
      <Link className="me-4" to={`/reportes/${id}`}>
        Ver detalle
      </Link>
      <IconButton onClick={() => updateScoring({ reportId: id, vote: 1, userId: 1 })}>
        {positiveScore}
        <ThumbUpIcon style={{ color: "#537ac9" }} />
      </IconButton>
      <IconButton onClick={() => updateScoring({ reportId: id, vote: 0, userId: 1 })}>
        {negativeScore}
        <ThumbDownAltIcon style={{ color: "#cc545d" }} />
      </IconButton>
    </Popup>
  );
}

export default PopupAT;
