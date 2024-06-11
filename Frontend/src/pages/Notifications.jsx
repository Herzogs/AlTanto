import { Container } from "react-bootstrap";
import Header from "@components/header/Header";
import Report from "@components/report/Report";
import { userStore } from "@store";
import { useEffect, useState } from "react";
import axiosInstance from "@interceptors/axiosConfig";

function Notifications() {
  const [infoZones, setInfoZones] = useState([null]);
  const [infoGroups, setInfoGroups] = useState([null]);
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
      console.log(data);
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
      console.log(data);
      setInfoGroups(data);
      setLoadingDos(false);
    });
  }, []);

  return (
    <>
      <Header />
      <Container fluid className="pt-4 pt-lg-5">
        <h2 className="text-center my-4">Mis notificaciones</h2>

        {!loading && (
          <div className="zone-reports">
            {infoZones.map((zone, index) => (
              <div key={index} className="mb-5">
                <h2>Zona: {zone.zoneName}</h2>
                {zone.reports.map((report) => (
                  <Report key={report.id} report={report} />
                ))}
              </div>
            ))}
          </div>
        )}

        {!loadingDos && (
          <div className="zone-reports">
            {infoGroups.map((group, index) => (
              <div key={index} className="mb-5">
                <h2>Grupo: {group.groupName}</h2>
                {group.reports.map((report) => (
                  <Report key={report.id} report={report} />
                ))}
              </div>
            ))}
          </div>
        )}

      </Container>
    </>
  );
}

export default Notifications;
