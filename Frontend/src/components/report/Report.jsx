/* eslint-disable react/prop-types */
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import iconRed from "@assets/iconRed.png";
import iconBlue from "@assets/iconBlue.png";
import iconGreen from "@assets/iconGreen.png";
import iconYellow from "@assets/iconYellow.png";
import iconOrange from "@assets/iconOrange.png";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Report({ report }) {
  const navigate = useNavigate();

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
        <p>{report.content}</p>
        {getIcon(report.categoryId)}
      </div>

      <div className="at-report-footer">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            handleViewDetails(report.id);
          }}
        >
          Ver detalle
        </button>
        <div>
          <ThumbUpIcon style={{ color: "#537ac9", marginRight: "32px" }} />
          <ThumbDownAltIcon style={{ color: "#cc545d" }} />
        </div>
      </div>
    </article>
  );
}

export default Report;
