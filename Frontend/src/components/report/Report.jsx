/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Report({ report }) {
  const navigate = useNavigate();

  const getIcon = (categoryId) => {
    switch (categoryId) {
      case 1:
        return <ErrorIcon style={{ color: "#cc545d" }} />;
      case 2:
        return <WarningIcon style={{ color: "#ea8e2e" }} />;
      default:
        return <InfoIcon style={{ color: "#52d2e2" }} />;
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/reportes/${id}`);
  };

  return (
    <article className="at-report">
      <div className="at-report-header">
        <h5>{report.categoryName}</h5>
        {getIcon(report.categoryId)}
      </div>
      <p>{report.content}</p>
      <div className="at-report-footer">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            handleViewDetails(report.id);
          }}
        >
          Ver detalle
        </Button>
        <div>
          <ThumbUpIcon style={{ color: "#537ac9", marginRight: "32px" }} />
          <ThumbDownAltIcon style={{ color: "#cc545d" }} />
        </div>
      </div>
    </article>
  );
}

export default Report;
