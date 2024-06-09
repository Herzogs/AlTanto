import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import AppsIcon from "@mui/icons-material/Apps";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./styles.css";

function Aside() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <aside>
      <article className="at-aside_button">
        <Button className="btn-aside" onClick={handleShow}>
          <AppsIcon />
        </Button>
      </article>

      <Offcanvas
        className="at-aside_offcanvas"
        show={show}
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mantenete Al Tanto</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <PinDropIcon /> Zonas
              </h5>
              <span>
                <AddCircleOutlineIcon /> Crear
              </span>
            </div>
            <ul>
              <li>UNLAM</li>
              <li>Trabajo</li>
              <li>Casa</li>
            </ul>
          </article>

          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <ForkRightIcon /> Recorridos
              </h5>
              <span>
                <AddCircleOutlineIcon /> Crear
              </span>
            </div>
            <ul>
              <li>Al trabajo</li>
              <li>A lo de mi abuela</li>
            </ul>
          </article>

          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <GroupsIcon /> Grupos
              </h5>
              <span>
                <AddCircleOutlineIcon /> Crear
              </span>
            </div>
            <ul>
              <li>5comentarios</li>
              <li>Profes</li>
            </ul>
          </article>

          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <NotificationsIcon /> Notificaciones
              </h5>
            </div>
            <ul>
              <li>Ver detalles</li>
            </ul>
          </article>
        </Offcanvas.Body>
      </Offcanvas>
    </aside>
  );
}

export default Aside;
