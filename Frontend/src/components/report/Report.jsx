/* eslint-disable react/prop-types */
import iconRed from "@assets/iconRed.png";
import iconBlue from "@assets/iconBlue.png";
import iconGreen from "@assets/iconGreen.png";
import iconYellow from "@assets/iconYellow.png";
import iconOrange from "@assets/iconOrange.png";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./styles.css";

function Report({ report }) {
  const navigate = useNavigate();
  const { createAt, category, content, id } = report;
  const formattedDate = format(new Date(createAt), "HH:mm - dd/MM/yyyy");

  const getIcon = (id) => {
    switch (id) {
      case 1:
        return <img src={iconRed} />;
      case 2:
        return <img src={iconBlue} />;
      case 3:
        return <img src={iconGreen} />;
      case 4:
        return <img src={iconYellow} />;
      default:
        return <img src={iconOrange} />;
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/reportes/${id}`);
  };

  return (
    <article className="at-report">
      <div className="at-report-header">
        <h6 className="fw-bold">{category.name}</h6>
        {getIcon(category.id)}
      </div>

      <div className="at-report-body text-start">
        <p className="my-2 h6">{content}</p>
      </div>

      <div className="at-report-footer">
        <p style={{ fontSize: "12px", fontWeight: "300", margin: "2px" }}>
          {formattedDate}hs
        </p>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            handleViewDetails(id);
          }}
        >
          Ver detalle
        </button>
      </div>
    </article>
  );
}

export default Report;
