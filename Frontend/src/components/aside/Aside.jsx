import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import AppsIcon from "@mui/icons-material/Apps";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./styles.css";
import { userStore } from "@store";
import { getRoutesByUserId } from "@services/getRoutesByUser";
import { getZoneByUserId } from "@services/getZone";
import { getGroupsByUserId } from "@services/groupService";
import { Link } from "react-router-dom";

function Aside() {
  const [show, setShow] = useState(false);
  const [zones, setZones] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [groups, setGroups] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { id } = userStore.getState().user;

  useEffect(() => {
    if (id) {
      getZoneByUserId(id)
        .then((data) => setZones(data))
        .catch((error) => console.error(error));
      getRoutesByUserId(id)
        .then((data) => setRoutes(data))
        .catch((error) => console.error(error));
      getGroupsByUserId(id)
        .then((data) => setGroups(data))
        .catch((error) => console.error(error));
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
              {zones.length === 0 && <li>No existen zonas guardadas</li>}
              {zones.map(({ id, name }) => (
                <Link to={`/zonas/${id}`} key={id}>
                  <li>{name}</li>
                </Link>
              ))}
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
              {routes.length === 0 && <li>No existen recorridos guardados</li>}
              {routes.map(({ id, name }) => (
                <Link to={`/rutas/${id}`} key={id}>
                  <li>{name}</li>
                </Link>
              ))}
            </ul>
          </article>

          <article className="mb-4">
            <div className="d-flex justify-content-between">
              <h5>
                <GroupsIcon /> Grupos
              </h5>
              <span>
                <Link to="/form/grupo">
                  <AddCircleOutlineIcon /> Crear
                </Link>
              </span>
            </div>
            <ul>
              {groups.length === 0 && <li>No existen grupos guardados</li>}
              {groups.map(({ id, name }) => (
                <li key={id}>{name}</li>
              ))}
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
