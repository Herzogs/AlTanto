import { Container } from "react-bootstrap";
import Report from "@components/report/Report";
import { useStore } from "@store";

function Notifications() {
  const { reports } = useStore();
  return (
    <Container fluid className="pb-footer">
      <h2 className="text-center my-4">Mis notificaciones</h2>
      <section className="d-flex justify-content-center flex-wrap gap-4">
        {reports ? (
          reports.map((report) => <Report key={report.id} report={report} />)
        ) : (
          <h3>No se encontraron reportes</h3>
        )}
      </section>
    </Container>
  );
}

export default Notifications;
