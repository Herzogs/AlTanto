import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { addUserToGroupWithCode } from "@services/groupService";
import { userStore } from "@store";

function JoinGroup() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const groupCode = searchParams.get("groupCode");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { user } = userStore();
  const userId = user?.id;

  useEffect(() => {
    const joinGroup = async () => {
      try {
        if (groupId && groupCode && userId) {
          await addUserToGroupWithCode({ groupId: Number(groupId), userId, groupCode });
          navigate(`/grupos/${groupId}`);
        } else {
          setError("Faltan parámetros necesarios para unirse al grupo.");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    joinGroup();
  }, [groupId, groupCode, userId, navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Uniéndose al grupo...</div>;
}

export default JoinGroup;
