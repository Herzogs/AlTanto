import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import Report from "../components/report/Report";
import { useNavigate } from "react-router-dom";

async function buscarTodosLosReportes() {
  try {
    const response = await fetch(`http://localhost:3000/api/report`);
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
        latitude: item.Location.latitude,
        longitude: item.Location.longitude,
        images: item?.images
      }));
      setReportesObtenidos(formattedData.reverse());
    });
  }, []);

  const getIconByType = (tipe) => {
    switch (tipe) {
      case 1:
        return InfoIcon;
      case 2:
        return ErrorIcon;
      default:
        return WarningIcon;
    }
  };

  const handleViewDetails = (report) => {
    navigate("/reportDetail", { state: { report } });
  };

  return (
    <Container>
      <button onClick={() => { console.log(reportesObtenidos); }}>xxxx</button>
      {reportesObtenidos.map((report) => (
        <Report
          key={report.id}
          report={report}
          title={report.title}
          description={report.content}
          icon={getIconByType(report.tipe)}
          icolor={"#29b6f6"}
          onViewDetails={() => handleViewDetails(report)}
        />
      ))}
    </Container>
  );
}

export default Notifications;