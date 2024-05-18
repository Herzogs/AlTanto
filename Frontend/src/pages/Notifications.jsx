import React from "react";
import { Container } from "react-bootstrap";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from '@mui/icons-material/Info';
import Report from "../components/report/Report";

function Notifications() {
  return (
    <Container>
      <Report
        title={"Seguridad"}
        description={"Dos personas en moto andan robando"}
        dtime={"11/05/2024 - 21:48hs"}
        icon={ErrorIcon}
        icolor={"#f44336"}
      />
      <Report
        title={"Clima"}
        description={"Posibilidades de granizo"}
        dtime={"21/05/2024 - 12:33hs"}
        icon={InfoIcon}
        icolor={"#29b6f6"}
      />
      <Report
        title={"Vía Pública"}
        description={"Calle cortada por manifestantes"}
        dtime={"10/05/2024 - 18:00hs"}
        icon={WarningIcon}
        icolor={"#ffa726"}
      />
    </Container>
  );
}

export default Notifications;
