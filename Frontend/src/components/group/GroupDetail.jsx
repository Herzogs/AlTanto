import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGroupById, removeUserFromGroup, deleteGroup, sendSOS, notificationRemoveUser } from "@services/groupService";
import { getUserByUsername } from "@services/userService";
import { fetchReportsByGroup } from "@services/getReportByGroup";
import { userStore } from "@store";
import { Col, Container, Row } from "react-bootstrap";
import Header from "@components/header/Header";
import MenuButton from "../Map/MenuButton";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import "./styles.css";
import { reverseGeocode } from "@services/getGeoAdress";
import { useStore } from "@store";
import SliderAT from "../slider/SliderAT";
import Modal_AT from "@components/modal/Modal_AT";
import ModalAT from "@components/modal/ModalAT";

function GroupDetail() {
  const { id } = useParams();
  const { userLocation } = useStore();
  const [groupDetails, setGroupDetails] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sosDisable, setSosDisable] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const { user } = userStore();
  const userId = user?.id;

  useEffect(() => {
    setLoading(true);
    const fetchGroupDetails = async () => {
      try {
        const details = await getGroupById(Number(id));
        setGroupDetails(details);
      } catch (error) {
        setError("Error al buscar grupo.");
        setShowErrorModal(true);
      }
    };

    const fetchGroupReports = async () => {
      try {
        const groupReports = await fetchReportsByGroup(id);
        setReports(groupReports);
      } catch (error) {
        setError("Error al buscar los reportes del grupo.");
        setShowErrorModal(true);
      }
    };

    fetchGroupDetails().finally(() => setLoading(false));
    fetchGroupReports();
  }, [id]);

  const handleSearchUser = async () => {
    try {
      const userFound = await getUserByUsername(username);
      setFoundUser(userFound);
    } catch (error) {
      setError("Error al buscar usuario. Verifique que el nombre sea correcto.");
      setShowErrorModal(true);
    }
  };

  const handleInviteUser = async () => {
    const { phoneNumber } = foundUser;
    if (!phoneNumber) {
      setError("El usuario no tiene un número de teléfono registrado.");
      setShowErrorModal(true);
      return;
    }

    const inviteMessage = `Hola ${foundUser.name},\n\n${user.name} te ha invitado a unirte al grupo "${groupDetails.name}".\n\nÚnete al grupo aquí:`;

    try {
      const appUrl = "https://altanto.vercel.app/join-group";
      const groupLink = `${appUrl}?groupId=${groupDetails.id}&groupCode=${groupDetails.groupCode}`;
      const whatsappMessage = `${inviteMessage}\n${groupLink}`;

      window.open(
        `https://api.whatsapp.com/send?phone=549${phoneNumber}&text=${encodeURIComponent(
          whatsappMessage
        )}`,
        "_blank"
      );

      navigate(`/grupos/${groupDetails.id}`);
    } catch (error) {
      setError("Error al intentar invitar usuario.");
      setShowErrorModal(true); 
    }
  };

  const handleInviteUsers = async () => {
    const inviteMessage = `Hola,\n\n${user.name} te ha invitado a unirte al grupo "${groupDetails.name}".\n\nÚnete al grupo aquí:`;

    try {
      const appUrl = "https://altanto.vercel.app/join-group";
      const groupLink = `${appUrl}?groupId=${groupDetails.id}&groupCode=${groupDetails.groupCode}`;
      const whatsappMessage = `${inviteMessage}\n${groupLink}`;

      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(
          whatsappMessage
        )}`,
        "_blank"
      );

      navigate(`/grupos/${groupDetails.id}`);
    } catch (error) {
      setError("Error al intentar invitar usuarios");
      setShowErrorModal(true); 
    }
  };

  const handleLeaveGroup = async (groupId, userIdToRemove) => {
    try {
      await removeUserFromGroup({ groupId, userId: userIdToRemove });
      navigate("/");
    } catch (error) {
      setError("Error al intentar abandonar el grupo.");
      setShowErrorModal(true); 
    }
  };

  const handleRemoveUser = async (groupId, userIdToRemove) => {
    try {
      await removeUserFromGroup({ groupId, userId: userIdToRemove });
      setGroupDetails((prevDetails) => ({
        ...prevDetails,
        members: prevDetails.members.filter(
          (member) => member.id !== userIdToRemove
        ),
      }));
      await notificationRemoveUser({ groupId, userId: userIdToRemove });
      navigate("/");
    } catch (error) {
      setError("Error al eliminar usuario.");
      setShowErrorModal(true);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    setShowModal(true);
  };

  const confirmDeleteGroup = async () => {
    try {
      await deleteGroup(groupDetails.id);
      navigate("/");
    } catch (error) {
      setError("Error al intentar eliminar el grupo.");
      setShowErrorModal(true); 
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const sendNotificationSOS = async () => {
    const address = await reverseGeocode({
      lat: userLocation.lat,
      lng: userLocation.lng,
    });
    await sendSOS(id, userId, address);
    setSosDisable(true);
  };

  return (
    <Row className="justify-content-center">
      <Col lg={6} className="at-desk_form">
        <Header />
        <Container className="container-md_stop pt-4 pt-lg-5">
          {groupDetails && (
            <>
              <article className="d-flex w-100 justify-content-between">
                <div>
                  <h2>{groupDetails.name}</h2>
                  {sosDisable && (
                    <p className="text-warning">
                      * <strong>SOS Enviado</strong>. Todos los miembros fueron
                      notificados.
                    </p>
                  )}
                </div>
                <div className="ms-4">
                  <button
                    className="btn btn-sos"
                    onClick={() => sendNotificationSOS()}
                    disabled={sosDisable}
                  >
                    SOS
                  </button>
                </div>
              </article>

              {groupDetails.ownerId === userId && (
                <div className="mt-3 mt-lg-4">
                  <h4>Invitar Usuario</h4>

                  <div className="d-flex">
                    <input
                      className="form-control"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                      style={{ textWrap: "nowrap" }}
                      className="btn btn-sm btn-primary"
                      onClick={handleSearchUser}
                    >
                      Buscar Usuario
                    </button>
                  </div>

                  {foundUser && (
                    <article className="d-flex align-items-center bg-primary-subtle p-3 my-3 rounded">
                      <h6 className="text-black mb-0">
                        Usuario encontrado: <strong>{foundUser.username}</strong>
                      </h6>
                      <button
                        className="btn btn-sm btn-success ms-3"
                        onClick={handleInviteUser}
                      >
                        Invitar al grupo
                      </button>
                    </article>
                  )}
                  
                  <button
                    className="btn btn-sm btn-secondary mt-2"
                    onClick={handleInviteUsers}
                  >
                    Invitar Usuarios
                  </button>
                </div>
              )}

              <h4 className="mt-4">Miembros</h4>
              <ul className="list-member">
                {!loading &&
                  groupDetails.members.map((member) => (
                    <li key={member.id} className="d-flex">
                      <h5 className="mt-3">
                        {member.username}
                        {member.id === groupDetails.ownerId && (
                          <AdminPanelSettingsIcon
                            className="text-danger ms-2"
                            fontSize="large"
                          />
                        )}
                      </h5>

                      {groupDetails.ownerId === userId &&
                        member.id !== groupDetails.ownerId && (
                          <PersonRemoveIcon
                            className="ms-2 mt-3 text-primary"
                            onClick={() =>
                              handleRemoveUser(groupDetails.id, member.id)
                            }
                          />
                        )}

                      {groupDetails.ownerId != userId &&
                        member.id !== groupDetails.ownerId && (
                          <DeleteForeverIcon
                            className="ms-2 mt-3 text-danger"
                            onClick={() =>
                              handleLeaveGroup(groupDetails.id, member.id)
                            }
                          />
                        )}
                    </li>
                  ))}
              </ul>

              {groupDetails.ownerId === userId && (
                <div className="text-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteGroup(groupDetails.id)}
                  >
                    <DeleteForeverIcon />
                    Borrar Grupo
                  </button>
                </div>
              )}

              <MenuButton groupId={groupDetails.id} />

              {reports.length > 0 && (
                <>
                  <h4 className="mt-4">Reportes del Grupo:</h4>
                  <SliderAT reports={reports} />
                </>
              )}

              <Modal_AT
                title="Confirmar Eliminación"
                message={`¿Está seguro de que desea eliminar el grupo "${groupDetails.name}"? Esta acción no se puede deshacer.`}
                showModal={showModal}
                setShowModal={setShowModal}
                confirmAction={confirmDeleteGroup}
                cancelAction={cancelDelete}
              />
            </>
          )}

          {error && (
            <ModalAT
              title="Error"
              message={`Ha ocurrido un error: ${error}`}
              showModal={showErrorModal}
              setShowModal={setShowErrorModal}
              url={null} 
            />
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default GroupDetail;
