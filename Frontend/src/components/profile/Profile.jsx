import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";

function Profile() {

  return (
    <article className="mb-4">
    <div className="d-flex justify-content-between">
      <h5>
        <NotificationsIcon /> Perfil
      </h5>
    </div>
    <ul>
      <Link to="/profile"><li>Ver Perfil</li></Link>
    </ul>
  </article>
  );
}

export default Profile;