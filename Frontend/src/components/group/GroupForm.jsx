import { useState, useEffect } from "react";
import {
  getGroupsByUserId,
  createGroup,
  findGroupByName,
  addUserToGroupWithCode,
} from "@services/groupService";
import { useNavigate } from "react-router-dom";
import { userStore } from "@store";
import { Container } from "react-bootstrap";
import Header from "@components/header/Header";

function GroupForm() {
  const [groupName, setGroupName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      const groupData = { name: groupName, ownerId: userId };
      const createdGroup = await createGroup(groupData);
      setGroups([...groups, createdGroup]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewDetails = (groupId) => {
    navigate(`/grupos/${groupId}`);
  };

  const handleSearchGroup = async () => {
    try {
      const foundGroups = await findGroupByName(searchName);
      navigate("/group-search", { state: { groups: foundGroups } });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleJoinGroupByCode = async () => {
    try {
      await addUserToGroupWithCode({ userId, groupCode });
      const userGroups = await getGroupsByUserId(userId);
      setGroups(userGroups);
      setGroupCode("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <Container className="container-md_stop pt-4 pt-lg-5">
        <h2>Crear Grupo</h2>

        <input
          className="form-control"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Ingresar nombre"
        />
        <button className="btn btn-success mt-3" onClick={handleCreateGroup}>
          Crear Grupo
        </button>

        <h3 className="mt-5">Mis Grupos</h3>
      <div className="d-flex gap-3">
        {groups.map((group) => (
          <div key={group.id} className="mt-4 bg-secondary p-4 rounded">
            <h5>{group.name}</h5>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleViewDetails(group.id)}
            >
              Ver Detalle
            </button>
          </div>
        ))}
      </div>
      {groups.length === 0 && <p>No estás en ningún grupo.</p>}

        <h3 className="mt-5">Unirse a un Grupo</h3>
        <input
          className="form-control"
          type="text"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          placeholder="Ingrese el código del grupo"
        />
        <button
          className="btn btn-primary mt-3"
          onClick={handleJoinGroupByCode}
        >
          Unirse al Grupo
        </button>

        {error && <p>Error: {error}</p>}
      </Container>
    </>
  );
}

export default GroupForm;
