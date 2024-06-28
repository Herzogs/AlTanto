import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGroupById, removeUserFromGroup, deleteGroup } from "@services/groupService";
import { getUserByUsername } from "@services/userService";
import { fetchReportsByGroup } from "@services/getReportByGroup";
import { userStore } from "@store";
import { Container } from "react-bootstrap";
import Header from "@components/header/Header";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuButton from "../Map/MenuButton";
import Report from "@components/report/Report";

function GroupDetail() {
  const { id } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
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
        setError(error.message);
      }
    };

    const fetchGroupReports = async () => {
      try {
        const groupReports = await fetchReportsByGroup(id);
        setReports(groupReports);
      } catch (error) {
        setError(error.message);
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
      setError(error.message);
    }
  };

  const handleInviteUser = async () => {
    const { phoneNumber } = foundUser;
    if (!phoneNumber) {
      setError("El usuario no tiene un número de teléfono registrado.");
      return;
    }
  
    const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');
  
    const includesCountryCode = formattedPhoneNumber.startsWith('+54'); 
  
    const internationalPhoneNumber = includesCountryCode ? formattedPhoneNumber : `+54${formattedPhoneNumber}`; 
  
    const inviteMessage = `Hola ${foundUser.name},\n\n${user.name} te ha invitado a unirte al grupo "${groupDetails.name}".\n\nÚnete al grupo haciendo click aquí:`;
  
    try {
      const appUrl = "http://localhost:5173/join-group";
  
      const groupLink = `${appUrl}?groupId=${groupDetails.id}&groupCode=${groupDetails.groupCode}`;
  
      const whatsappMessage = `${inviteMessage}\n${groupLink}`;
  
      window.open(`https://api.whatsapp.com/send?phone=${internationalPhoneNumber}&text=${encodeURIComponent(whatsappMessage)}`, "_blank");
  
      navigate(`/grupos/${groupDetails.id}`);
    } catch (error) {
      setError(error.message);
    }
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
        members: prevDetails.members.filter((member) => member.id !== userIdToRemove),
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
    <Header/>
      <Container className="container-md_stop">
      <p className="text-end"><Link to="/form/grupo"><ArrowBackIcon/> Regresar</Link></p>
        <h1>{groupDetails.name}</h1>
        <p>
          Código de Grupo: <strong>{groupDetails.groupCode}</strong>
        </p>
        <MenuButton groupId={groupDetails.id} />
        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGroup(groupDetails.id)}>
          Borrar Grupo
        </button>

        <h3 className="mt-4">Miembros:</h3>
        <ul>
          {!loading && groupDetails.members.map((member) => (
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
              {groupDetails.ownerId === userId && member.id !== groupDetails.ownerId && (
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

        <h3 className="mt-4">Reportes del Grupo:</h3>
        <section className="d-flex justify-content-center flex-wrap gap-4">
          {reports.length > 0 ? (
            reports.map((report) => <Report key={report.id} report={report} />)
          ) : (
            <h3>No se encontraron reportes</h3>
          )}
        </section>

      </Container>
    </>
  );
}

export default GroupDetail;
