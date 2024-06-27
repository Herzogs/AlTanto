/* eslint-disable react/prop-types */
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import iconRed from "@assets/iconRed.png";
import iconBlue from "@assets/iconBlue.png";
import iconGreen from "@assets/iconGreen.png";
import iconYellow from "@assets/iconYellow.png";
import iconOrange from "@assets/iconOrange.png";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { updateScoring } from "@services/sendData";
import { IconButton } from "@mui/material";
import "./styles.css";

function Report({ report }) {
  const navigate = useNavigate();
  const { createAt, categoryId, content, id, positiveScore, negativeScore } = report;
  const formattedDate = format(new Date(createAt), "HH:mm - dd/MM/yyyy");

  const getIcon = (categoryId) => {
    switch (categoryId) {
      case 1:
        return <img src={iconRed} />;
      case 2:
        return <img src={iconBlue} />;
      case 3:
        return <img src={iconGreen} />;
      case 4:
        return <img src={iconYellow} />;
      case 5:
        return <img src={iconOrange} />;
      default:
        return <img src={iconYellow} />;
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/reportes/${id}`);
  };

  return (
    <article className="at-report">
      <div className="at-report-header">
        <p>{content}</p>
        {getIcon(categoryId)}
      </div>

      <div className="at-report-footer">
        <p className="my-2">{formattedDate}</p>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            handleViewDetails(id);
          }}
        >
          Ver detalle
        </button>
        <div>
          <IconButton onClick={() => updateScoring({ reportId: id, vote: 1, userId: 1 })}>
            {positiveScore}
            <ThumbUpIcon style={{ color: "#537ac9" }} />
          </IconButton>
          <IconButton onClick={() => updateScoring({ reportId: id, vote: 0, userId: 1 })}>
            {negativeScore}
            <ThumbDownAltIcon style={{ color: "#cc545d" }} />
          </IconButton>
        </div>
      </div>
    </article>
  );
}

export default Report;
