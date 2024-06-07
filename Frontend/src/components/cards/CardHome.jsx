import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";

function CardHome() {
    
  return (
    <article className="card-home">
      <div className="d-flex mb-3">
        <AccountCircleIcon style={{ fontSize: "32px", marginRight: "12px" }} />
        <h3>Nombre Usuario</h3>
      </div>

      <h5>
        <Link to="/grupos">
          <GroupsIcon className="me-3" /> Grupos
        </Link>
      </h5>
      <hr />
      <h5>
        <Link to="/zonas">
          <PinDropIcon className="me-3" /> Zonas
        </Link>
      </h5>
      <h5>
        <Link to="/recorridos">
          <ForkRightIcon className="me-3" /> Recorridos
        </Link>
      </h5>

      <h5>
        <Link to="/notificaciones">
          <NotificationsIcon className="me-3" /> Notificaciones
        </Link>
      </h5>
    </article>
  );
}

export default CardHome;
