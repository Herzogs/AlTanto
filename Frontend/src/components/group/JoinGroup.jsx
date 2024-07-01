import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { addUserToGroupWithCode } from "@services/groupService";
import { userStore } from "@store";
import ModalAT from "@components/modal/ModalAT";

function JoinGroup() {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const groupCode = searchParams.get("groupCode");
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
          setModalError("Faltan parámetros necesarios para unirse al grupo.");
          setShowModal(true);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    joinGroup();
  }, [groupId, groupCode, userId, navigate]);

  useEffect(() => {
    if (error) {
      setModalError(`Error al intentar unirse al grupo.`);
      setShowModal(true);
    }
  }, [error]);

  if (error && !modalError) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>Uniéndose al grupo...</div>
      {modalError && (
        <ModalAT
          title="Error"
          message={modalError}
          showModal={showModal}
          setShowModal={setShowModal}
          url={"/"}
        />
      )}
    </>
  );
}

export default JoinGroup;
