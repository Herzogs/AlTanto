/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  getGroupsByUserId,
  createGroup
} from "@services/groupService";
import { userStore } from "@store";
import { Col, Container, Row } from "react-bootstrap";
import Header from "@components/header/Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import ModalAT from "@components/modal/ModalAT";

function GroupForm() {
  const [groupName, setGroupName] = useState("");
  const [errorForm, setErrorForm] = useState(false);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = userStore();
  const userId = user?.id;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userGroups = await getGroupsByUserId(userId);
        setGroups(userGroups);
      } catch (error) {
        setError(error.message);
      }
    };

    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  const handleCreateGroup = async () => {
    try {
      if (groupName) {
        setErrorForm(false)
        const groupData = { name: groupName, ownerId: userId };
        const createdGroup = await createGroup(groupData);
        setGroups([...groups, createdGroup]);
        setShowModal(true);
      } else setErrorForm(true);
    } catch (error) {
      setShowModal(false);
      setError(error.message);
    }
  };


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
          <h2>Crear Grupo</h2>

          <input
            className="form-control"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Ingresar nombre"
          />
          {errorForm && <p className="text-danger">* Error al crear el grupo</p>}
          <button className="btn btn-success mt-3" onClick={handleCreateGroup}>
            Crear Grupo
          </button>

          <ModalAT
            title="Grupo guardado"
            message="Se registraron correctamente los datos."
            showModal={showModal}
            setShowModal={setShowModal}
            url={"/"}
          />

          {error && <p>* Error al procesar los datos</p>}
        </Container>
      </Col>
    </Row>
  );
}

export default GroupForm;
