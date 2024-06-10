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

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link } from 'react-router-dom';

function Groups({handleClose}) {
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
    <article className="mb-4">
      <div className="d-flex justify-content-between">
        <h5>
          <GroupsIcon /> Grupos
        </h5>
        <span>
          <Link to="/">
            <AddCircleOutlineIcon /> Crear
          </Link>
        </span>
      </div>

      <ul>
        {groups && groups.length > 0 && (
          <>
            {groups.map((group) => (
              <Link key={group.id} to={`/grupos/${group.id}`} onClick={handleClose}>
                <li>{group.name}</li>
              </Link>
            ))}
          </>
        )}
      </ul>
    </article>
  );
}

export default Groups;
