import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getGroupById,
  removeUserFromGroup,
  deleteGroup,
} from "@/services/groupService";
import { getUserByUsername } from "@services/userService";
import { userStore } from "@/store/index";
import { Container } from "react-bootstrap";
import Header from "@components/header/Header";

function GroupDetail() {
  const { id } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const navigate = useNavigate();

  const { user } = userStore();
  const userId = user?.id;

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const details = await getGroupById(Number(id));
        setGroupDetails(details);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleSearchUser = async () => {
    try {
      const userFound = await getUserByUsername(username);
      setFoundUser(userFound);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInviteUser = () => {
    const { phoneNumber } = foundUser;
    if (!phoneNumber) {
      setError("El usuario no tiene un número de teléfono registrado.");
      return;
    }

    const inviteMessage = `Hola ${foundUser.name},\n\n${user.name} te ha invitado a unirte al grupo "${groupDetails.name}".\n\nCódigo del grupo: ${groupDetails.groupCode}\n\n¡Únete a nosotros en WhatsApp!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      inviteMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleLeaveGroup = async (groupId, userIdToRemove) => {
    try {
      await removeUserFromGroup({ groupId, userId: userIdToRemove });
      navigate("/grupos");
    } catch (error) {
      setError(error.message);
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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      navigate("/grupos");
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!groupDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Container className="container-md_stop pt-4 pt-lg-5">
        <h1>{groupDetails.name}</h1>
        <p>
          Código de Grupo: <strong>{groupDetails.groupCode}</strong>
        </p>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteGroup(groupDetails.id)}
        >
          Borrar Grupo
        </button>

        <h3 className="mt-4">Miembros:</h3>
        <ul>
          {groupDetails.members.map((member) => (
            <li key={member.id}>
              <h5 className="mt-3">{member.name}</h5>
              <strong>
                {member.id === groupDetails.ownerId && "* Propietario"}
              </strong>

              {userId === member.id && (
                <>
                  <br />
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleLeaveGroup(groupDetails.id, member.id)}
                  >
                    Abandonar grupo
                  </button>
                </>
              )}
              {groupDetails.ownerId === userId &&
                member.id !== groupDetails.ownerId && (
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleRemoveUser(groupDetails.id, member.id)}
                  >
                    Eliminar usuario
                  </button>
                )}
            </li>
          ))}
        </ul>

        {groupDetails.ownerId === userId && (
          <div className="mt-5">
            <h3>Invitar Usuario</h3>
            <input
              className="form-control"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={handleSearchUser}>
              Buscar Usuario
            </button>

            {foundUser && (
              <div>
                <strong>Usuario encontrado: {foundUser.username}</strong>
                <button onClick={handleInviteUser}>Invitar Usuario</button>
              </div>
            )}
          </div>
        )}

        <Link className="btn btn-secondary px-3 mt-5" to="/">
          Volver
        </Link>
      </Container>
    </>
  );
}

export default GroupDetail;
