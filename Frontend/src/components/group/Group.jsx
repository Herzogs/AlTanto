import { useState, useEffect } from "react";
import { getGroupsByUserId, createGroup, findGroupByName, addUserToGroupWithCode } from "@services/groupService";
import { useNavigate } from "react-router-dom";
import { userStore } from "@store";

function Group() {
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
      console.log("Group created:", createdGroup);
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
      navigate('/group-search', { state: { groups: foundGroups } });
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
    <div>
      <h2>Crear Grupo</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleCreateGroup}>Crear Grupo</button>

      <h3>Mis Grupos</h3>
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            {group.name}
            <button onClick={() => handleViewDetails(group.id)}>Ver Detalles</button>
          </li>
        ))}
      </ul>
      {groups.length === 0 && <p>No estás en ningún grupo.</p>}

      <h3>Buscar Grupo por Nombre</h3>
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={handleSearchGroup}>Buscar Grupo</button>

      <h3>Unirse a un Grupo por Código</h3>
      <input
        type="text"
        value={groupCode}
        onChange={(e) => setGroupCode(e.target.value)}
        placeholder="Ingrese el código del grupo"
      />
      <button onClick={handleJoinGroupByCode}>Unirse al Grupo</button>

      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Group;
