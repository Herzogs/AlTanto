import { useState, useEffect } from "react";
import { getUserById } from "../services/userService";
import { userStore } from "@store";
import { Container, Row, Col } from "react-bootstrap";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Header from "@components/header/Header";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function UserProfile({ handleClose }) {
  const { user } = userStore();
  const userId = user?.id;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Row className="justify-content-center">
      <Col lg={6} className="at-desk_form">
        <Header />
        <Container className="container-md_stop pt-4 pt-lg-5">
          <p className="text-end">
            <Link to="/">
              <ArrowBackIcon /> Regresar
            </Link>
          </p>
          <div className="text-center">
            <h3>
              <AccountCircleIcon /> Perfil de Usuario
            </h3>
          </div>

          <div className="mt-3">
            <div className="container_zonas-item container">
              <div className="zonas-item">
                <h5>Usuario {userData.username}</h5>
                <p>
                  <strong>Nombre</strong> {userData.name}
                </p>
                <p>
                  <strong>Apellido</strong> {userData.lastName}
                </p>
                <p>
                  <strong>Email</strong> {userData.email}
                </p>
                <p>
                  <strong>Teléfono</strong> {userData.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Col>
    </Row>
  );
}

export default UserProfile;
