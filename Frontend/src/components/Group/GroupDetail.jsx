import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGroupById, removeUserFromGroup } from "@/services/groupService";
import { userStore } from '@/store/index'; 

function GroupDetail() {
    const { id } = useParams();
    const [groupDetails, setGroupDetails] = useState(null);
    const [error, setError] = useState(null);
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
            setGroupDetails(prevDetails => ({
                ...prevDetails,
                members: prevDetails.members.filter(member => member.id !== userIdToRemove),
            }));
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
        <div>
            <h1>{groupDetails.name}</h1>
            <p>Group Code: {groupDetails.groupCode}</p>
            <h2>Members:</h2>
            <ul>
                {groupDetails.members.map(member => (
                    <li key={member.id}>
                        {member.name}
                        {member.id === groupDetails.ownerId && " (Propietario)"}
                        {userId === member.id && (
                            <button onClick={() => handleLeaveGroup(groupDetails.id, member.id)}>Abandonar grupo</button>
                        )}
                        {groupDetails.ownerId === userId && member.id !== groupDetails.ownerId && (
                            <button onClick={() => handleRemoveUser(groupDetails.id, member.id)}>Eliminar usuario</button>
                        )}
                    </li>
                ))}
            </ul>

            <Link to="/grupos">Volver</Link>
        </div>
    );
}

export default GroupDetail;
