import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import AppsIcon from "@mui/icons-material/Apps";
import Zones from "@components/Zone/Zones";
import Roads from "@components/road/Roads";
import Groups from "@components/group/Groups";
import Notifications from "@components/notification/Notifications";
import { Link } from "react-router-dom";
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

      <Offcanvas className="at-aside_offcanvas" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><Link to="/">Mantenete Al Tanto</Link></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Zones handleClose={handleClose} />
          <Roads handleClose={handleClose} />
          <Groups handleClose={handleClose} />
          <Notifications handleClose={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>
    </aside>
  );
}

export default Aside;
