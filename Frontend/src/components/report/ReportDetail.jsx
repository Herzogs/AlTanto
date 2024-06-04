import { useState, useEffect } from "react";
import { Container, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Map from "@components/Map/Map";
import { useStore } from "@store";
import { fetchReportById } from "@services/getReport";

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const { userLocation, setUserLocation } = useStore();

  useEffect(() => {
    const getReport = async () => {
      try {
        const data = await fetchReportById(id);
        setReport(data);
        setUserLocation({
          lat: +data.location.latitude,
          lng: +data.location.longitude,
        });
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    getReport();
  }, [id, setUserLocation]);

  if (!report) {
    return <div>Cargando...</div>;
  }

  const { content, images } = report;

  return (
    <section className="container_home">
      <Container fluid className="h-100">
        <article className="text-center mb-5">
          <h2 className="my-4">Detalle del reporte</h2>
          <h5>Descripción: {content}</h5>
          {images && (
            <Image
              src={`http://localhost:3000/static/images/${images}`}
              style={{ width: "100%", maxWidth: "600px" }}
              alt="Imagen del reporte"
            />
          )}
        </article>
        <div className="h-map pb-footer">
          <Map userLocation={userLocation} noDrag={true} zoneMode={true} />
        </div>
      </Container>
    </section>
  );
}

export default ReportDetail;
