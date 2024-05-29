import Dropdown from "react-bootstrap/Dropdown";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";
function MenuButton() {
  return (
    <Dropdown
      style={{
        position: "absolute",
        bottom: "40%",
        right: "2%",
        zIndex: "999",
      }}
    >
      <Dropdown.Toggle id="dropdown-basic" as="span" style={{ color: "none" }}>
        <AddCircleIcon className="text-at-grey" style={{ fontSize: "50px" }} />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item>
          <Link to="/form/reporte">Reporte Manual</Link>
        </Dropdown.Item>
        <Dropdown.Item>
          <Link to="/form/reporte/automatico">Reporte Automatico</Link>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MenuButton;
