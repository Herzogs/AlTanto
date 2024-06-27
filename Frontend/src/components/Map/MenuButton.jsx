/* eslint-disable react/prop-types */
import Dropdown from "react-bootstrap/Dropdown";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Link } from "react-router-dom";

function MenuButton({ groupId }) {
  return (
    <Dropdown className="menu-button">
      <Dropdown.Toggle id="dropdown-basic" as="button">
        <AddCircleIcon className="menu-button_icon" />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Item as={Link} to={`/form/reporte${groupId ? `/${groupId}` : ""}`}>
          Reporte Manual
        </Dropdown.Item>
        <Dropdown.Item as={Link} to={`/form/reporte/automatico${groupId ? `/${groupId}` : ""}`}>
          Reporte Automático
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MenuButton;
