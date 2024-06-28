/* eslint-disable react/prop-types */
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Popup } from "react-leaflet";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { updateScoring } from "@services/sendData";
import { useState, useEffect } from "react";

function PopupAT({ report }) {
  const { createAt, categoryName, content, id, positiveScore, negativeScore } = report;
  const [posScore, setPosScore] = useState(positiveScore);
  const [negScore, setNegScore] = useState(negativeScore);

  const formattedDate = format(new Date(createAt), "dd/MM/yyyy - HH:mm");

  const handleVote = async (vote) => {
    const response = await updateScoring({ reportId: id, vote, userId: 1 });
    if (response.status === 200) {
      if (vote === 1) {
        setPosScore((prev) => prev + 1);
      } else {
        setNegScore((prev) => prev + 1);
      }
    }
  };

  return (
    <Popup className="at-popup">
      <h6 className="fw-bold">{categoryName}</h6>
      <p className="my-2 h6">{content}</p>
      <p style={{fontSize:'12px', fontWeight: '300', margin: '2px'}}>{formattedDate}hs</p>
      <Link className="me-4 text-primary" to={`/reportes/${id}`}>
        Ver detalle
      </Link>
      <IconButton onClick={() => handleVote(1)}>
        <small style={{ fontSize: "14px", marginRight: "6px" }}>
          {posScore}
        </small>
        <ThumbUpIcon style={{ color: "#537ac9" }} />
      </IconButton>
      <IconButton onClick={() => handleVote(0)}>
        <small style={{ fontSize: "14px", marginRight: "6px" }}>
          {negScore}
        </small>
        <ThumbDownAltIcon style={{ color: "#cc545d" }} />
      </IconButton>
    </Popup>
  );
}

export default PopupAT;
