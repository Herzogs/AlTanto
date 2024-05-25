import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import Report from "@/components/report/Report";
import { useNavigate } from "react-router-dom";

async function buscarTodosLosReportes() {
  try {
    const response = await fetch(`http://localhost:3000/api/reports`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

function Notifications() {
  const [reportesObtenidos, setReportesObtenidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    buscarTodosLosReportes().then((data) => {
      const formattedData = data.map((item) => ({
        id: item.id,
        tipe: item.CategoryId,
        title: item.title,
        content: item.content,
        distancia: 500,
        latitude: item.location.latitude,
        longitude: item.location.longitude,
        images: item?.images
      }));
      setReportesObtenidos(formattedData.reverse());
    });
  }, []);

  const getIconByType = (tipe) => {
    switch (tipe) {
      case 1:
        return ErrorIcon;
      case 2:
        return InfoIcon;
      default:
        return WarningIcon;
    }
  };

  const handleViewDetails = (report) => {
    navigate("/report", { state: { report } });
  };

  return (
    <Container>
      <h3>Mis notificaciones</h3>
      {reportesObtenidos.map((report) => (
        <Report
          key={report.id}
          report={report}
          title={report.title}
          description={report.content}
          icon={getIconByType(report.tipe)}
          icolor={"#cc545d"}
          onViewDetails={() => handleViewDetails(report)}
        />
      ))}
    </Container>
  );
}

export default Notifications;
