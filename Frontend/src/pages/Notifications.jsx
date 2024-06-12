import { Container, Accordion } from "react-bootstrap";
import Header from "@components/header/Header";
import Report from "@components/report/Report";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import { userStore } from "@store";
import { useEffect, useState } from "react";
import axiosInstance from "@interceptors/axiosConfig";

function Notifications() {
  const [infoZones, setInfoZones] = useState([]);
  const [infoGroups, setInfoGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDos, setLoadingDos] = useState(true);
  const { user } = userStore();

  useEffect(() => {
    const getZonesAndNotifications = async () => {
      const response = await axiosInstance.post("/zones/notification", {
        userId: user.id,
      });
      if (response.status === 200) {
        return response.data;
      }
    };

    getZonesAndNotifications().then((data) => {
      setInfoZones(data);
      setLoading(false);
    });

    const getGroupsAndNotifications = async () => {
      const response = await axiosInstance.post("/group/notification", {
        userId: user.id,
      });
      if (response.status === 200) {
        return response.data;
      }
    };

    getGroupsAndNotifications().then((data) => {
      setInfoGroups(data);
      setLoadingDos(false);
    });
  }, [user.id]);

  return (
    <>
      <Header />
      <Container className="pt-4 pt-lg-5">
        <section className="text-center">
          <p className="text-end">
            <Link to="/">
              <ArrowBackIcon /> Regresar
            </Link>
          </p>
          <h2 className="text-center my-4">Mis notificaciones</h2>

          {!loading && (
            <div className="zone-reports">
              {infoZones.map(
                (zone, index) =>
                  zone.reports.length > 0 && (
                    <div key={index} className="mb-5">
                      <h3>Zona: {zone.zoneName}</h3>
                      <article className="d-lg-flex gap-3">
                        {zone.reports.slice(0, 3).map((report) => (
                          <Report key={report.id} report={report} />
                        ))}
                      </article>
                      {zone.reports.length > 3 && (
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header><strong>Ver más</strong></Accordion.Header>
                            <Accordion.Body>
                              {zone.reports.slice(3).map((report) => (
                                <Report key={report.id} report={report} />
                              ))}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      )}
                    </div>
                  )
              )}
            </div>
          )}

          {!loadingDos && (
            <div className="zone-reports">
              {infoGroups.map(
                (group, index) =>
                  group.reports.length > 0 && (
                    <div key={index} className="mb-5">
                      <h3>Grupo: {group.groupName}</h3>
                      {group.reports.slice(0, 3).map((report) => (
                        <Report key={report.id} report={report} />
                      ))}
                      {group.reports.length > 3 && (
                        <Accordion>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header><strong>Ver más</strong></Accordion.Header>
                            <Accordion.Body>
                              {group.reports.slice(3).map((report) => (
                                <Report key={report.id} report={report} />
                              ))}
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      )}
                    </div>
                  )
              )}
            </div>
          )}
        </section>
      </Container>
    </>
  );
}

export default Notifications;
