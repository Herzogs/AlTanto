/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getGroupsByUserId } from "@services/groupService";
import { userStore } from "@store";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import { Link } from "react-router-dom";

function Groups({ handleClose }) {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  const { user } = userStore();
  const userId = user?.id;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userGroups = await getGroupsByUserId(userId);
        setGroups(userGroups);
      } catch (error) {
        console.log(error)
        setError(error.message);
      }
    };

    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  return (
    <article className="mb-4">
      <div className="d-flex justify-content-between">
        <h5>
          <GroupsIcon /> Grupos
        </h5>
        <span>
          <Link to="/form/grupo">
            <AddCircleOutlineIcon /> Crear
          </Link>
        </span>
      </div>

      <ul>
        {groups && groups.length > 0 && (
          <>
            {groups.map((group) => (
              <Link
                key={group.id}
                to={`/grupos/${group.id}`}
                onClick={handleClose}
              >
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
