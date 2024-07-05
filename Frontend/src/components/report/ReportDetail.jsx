import { useState, useEffect } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Header from "@components/header/Header";
import Map from "@components/Map/Map";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useStore } from "@store";
import { fetchReportById } from "@services/getReport";
import { format } from "date-fns";

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const { userLocation, setUserLocation, setReports } = useStore();

  useEffect(() => {
    setReports([]);
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

  const { content, images, createAt } = report;
  const formattedDate = format(new Date(createAt), "HH:mm - dd/MM/yyyy");

  return (
    <Row className="justify-content-center">
      <Col lg={6} className="at-desk_form">
        <Header />
        <Container className="container-md_stop pt-4 pt-lg-5">
          <p className="text-end">
            <Link to="/">
              <ArrowBackIcon /> Regresar
            </Link>
          </p>
          <article className="text-center mb-3">
            <h2 className="my-4">Detalle del reporte</h2>
            <h5>Descripción: {content}</h5>
            <h6>Fecha: {formattedDate}</h6>

            {images && (
              <Image
                src={images}
                style={{ width: "100%" }}
                alt="Imagen del reporte"
              />
            )}
          </article>
          <div style={{height: "50vh"}}>
          <Map userLocation={userLocation} zoneMode={true} />
          </div>
        </Container>
      </Col>
    </Row>
  );
}

export default ReportDetail;
