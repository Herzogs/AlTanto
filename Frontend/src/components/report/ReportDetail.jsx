import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Map from "../Map/Map";
import { useStore } from "../../store";
import { fetchReportById } from "../../services/getReport";

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const { userLocation, setUserLocation, setReports } = useStore();

  useEffect(() => {
    const getReport = async () => {
      try {
        const data = await fetchReportById(id);
        setReport(data);
        setUserLocation({ lat: +data.location.latitude, lng: +data.location.longitude });
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    getReport();
  }, [id, setUserLocation]);

  if (!report) {
    return <div>Cargando...</div>;
  }

  const { title, content, location, images } = report;

  return (
    <section className="container_home">
      <div className="top-section">
        <Container>
          <h2>Detalle del reporte</h2>
          <p>Título: {title}</p>
          <p>Descripción: {content}</p>
          {images && (
            <img
              src={`http://localhost:3000/static/images/${images}`}
              style={{ maxWidth: "400px" }}
              alt="Imagen del reporte"
            />
          )}
        </Container>
      </div>
      <div className="bottom-section">
        <Map userLocation={userLocation} />
      </div>
    </section>
  );
}

export default ReportDetail;
