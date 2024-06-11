import { Container } from "react-bootstrap";
import Header from "@components/header/Header";
import Report from "@components/report/Report";
import { userStore } from "@store";
import { useEffect, useState } from "react";
import axiosInstance from "@interceptors/axiosConfig"

function Notifications() {
  const [infoZones, setInfoZones] = useState(null);
  const { user } = userStore();

  useEffect(() => {
    console.log(user.id)
    
      const getReports = async () => {
        const response = await axiosInstance.post("/zones/notification", {
          userId: user.id
        });
        if (response.status === 200) {
          return response.data;
        }
      }
  
      getReports().then((data) => {
        console.log(data)
        setInfoZones(data);
      });

  }, []);
  console.log(infoZones);
  return (
    <>
      <Header />
      <button onClick={() => console.log(infoZones[0])}>Click</button>
      <Container fluid className="pt-4 pt-lg-5">
        <h2 className="text-center my-4">Mis notificaciones</h2>
        <section className="d-flex justify-content-center flex-wrap gap-4">
          {(infoZones === undefined || infoZones === null) && infoZones.reports.length === 0 && <h3>No se encontraron reportes</h3>}
          {(infoZones !== undefined && infoZones !== null) && infoZones.reports.length > 0 && infoZones.map((info) =>
            info.reports.map((report) => {
              return <Report key={report.id} report={report} />;
            }
            )
          )
        }
          
        </section>
      </Container>
    </>
  );
}

export default Notifications;
