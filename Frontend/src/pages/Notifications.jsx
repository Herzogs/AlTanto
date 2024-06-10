import { Container } from "react-bootstrap";
import Header from "@components/header/Header";
import Report from "@components/report/Report";
import { useStore } from "@store";

function Notifications() {
  const { reports } = useStore();

  return (
    <>
      <Header />
      <Container fluid className="pt-4 pt-lg-5">
        <h2 className="text-center my-4">Mis notificaciones</h2>
        <section className="d-flex justify-content-center flex-wrap gap-4">
          {reports && reports.length > 0 ? (
            reports.map((report) => <Report key={report.id} report={report} />)
          ) : (
            <h3>No se encontraron reportes</h3>
          )}
        </section>
      </Container>
    </>
  );
}

export default Notifications;
