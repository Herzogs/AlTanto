import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import AppsIcon from "@mui/icons-material/Apps";
import { useState, useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./styles.css";
import { Link } from "react-router-dom";
import { getZoneByUserId } from "@services/getZone";
import { getRoutesByUserId } from "@services/getRoutesByUser";
import { userStore } from "@store";

function Aside() {
  const [show, setShow] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [recorridos, setRecorridos] = useState([]);
  const [grupos, setGrupos] = useState(null);
  const { id } = userStore.getState().user;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (id) {
      getZoneByUserId(id)
        .then((response) => {
          setZonas(response);
        })
        .catch((error) => {
          console.log(error);
        });

      getRoutesByUserId(id)
        .then((response) => {
          setRecorridos(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  return (
    <aside>
      <article className="at-aside_button">
        <Button className="btn-aside" onClick={handleShow}>
          <AppsIcon />
        </Button>
      </article>

      <Offcanvas className="at-aside_offcanvas" show={show} onHide={handleClose}>
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
                <Link to="/form/zona">
                  <AddCircleOutlineIcon /> Crear
                </Link>
              </span>
            </div>
            <ul>
              {zonas.length > 0 ? (
                zonas.map((zona) => (
                  <li key={zona.id}>
                    <Link to={`/zonas/${zona.id}`}>{zona.name}</Link>
                  </li>
                ))
              ) : (
                <li>No hay zonas creadas</li>
              )}
            </ul>
          </article>

          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <ForkRightIcon /> Recorridos
              </h5>
              <span>
                <Link to="/form/ruta">
                  <AddCircleOutlineIcon /> Crear
                </Link>
              </span>
            </div>
            <ul>
              {recorridos.length > 0 ? (
                recorridos.map((recorrido) => (
                  <li key={recorrido.id}>
                    <Link to={`/recorridos/${recorrido.id}`}>{recorrido.name}</Link>
                  </li>
                ))
              ) : (
                <li>No hay recorridos creados</li>
              )}
            </ul>
          </article>

          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <GroupsIcon /> Grupos
              </h5>
              <span>
                <Link to="/form/grupos">
                  <AddCircleOutlineIcon /> Crear
                </Link>
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
