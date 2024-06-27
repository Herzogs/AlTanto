import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PinDropIcon from "@mui/icons-material/PinDrop";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { userStore } from "@store";
import { Link } from "react-router-dom";

function CardHome() {
  const { id, name, lastName } = userStore.getState().user;

  return (
    <>
      <article className="card-home h-100">
        <div className="d-flex mb-3">
          <AccountCircleIcon
            style={{ fontSize: "32px", marginRight: "12px" }}
          />

          <h4>
            {id ? (
              <>
                {name} {lastName}
              </>
            ) : (
              "Invitado"
            )}
          </h4>
        </div>

        {id && (
          <>
            <h5>
              <Link to="/profile" className="d-flex align-items-center">
                <AccountCircleIcon className="me-3" /> Perfil
              </Link>
            </h5>
            <hr />
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
          </>
        )}
      </article>
    </>
  );
}

export default CardHome;
