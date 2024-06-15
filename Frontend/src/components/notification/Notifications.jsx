import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";

function Notifications() {

  return (
    <article className="mb-4">
    <div className="d-flex justify-content-between">
      <h5>
        <NotificationsIcon /> Notificaciones
      </h5>
    </div>
    <ul>
      <Link to="/notificaciones"><li>Ver detalles</li></Link>
    </ul>
  </article>
  );
}

export default Notifications;
