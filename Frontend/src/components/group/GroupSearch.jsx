import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { addUserToGroupWithCode } from '@/services/groupService';
import { userStore } from '@/store/index'; 

function GroupSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const groups = location.state.groups || [];
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { user } = userStore();
  const userId = user?.id;

  const handleJoinGroup = async () => {
    if (!selectedGroup) return;

    try {
      await addUserToGroupWithCode({ groupId: selectedGroup, userId, groupCode });
      navigate(`/grupos/${selectedGroup}`);
    } catch (error) {
      setError('Error al unirse al grupo. Por favor, verifica el código.');
    }
  };

  const handleRequestJoin = (groupId) => {
    setSelectedGroup(groupId);
    setGroupCode('');
    setError('');
  };

  return (
    <div>
      <h2>Resultados de la Búsqueda</h2>
      {error && <p>{error}</p>}
      {groups.length === 0 ? (
        <p>No se encontraron grupos con ese nombre.</p>
      ) : (
        <ul>
          {groups.map(group => (
            <li key={group.id}>
              {group.name}
              {selectedGroup === group.id ? (
                <div>
                  <input
                    type="text"
                    placeholder="Código de grupo"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                  />
                  <button onClick={handleJoinGroup}>Unirse al Grupo</button>
                </div>
              ) : (
                <button onClick={() => handleRequestJoin(group.id)}>Solicitar Unirse</button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/grupos">Volver</Link>
    </div>
  );
}

export default GroupSearch;
