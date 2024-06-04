import React, { useState } from "react";
import { createGroup } from "@/services/groupService";

function Group() {
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = async () => {
    try {
      const groupData = { name: groupName, ownerId: 1 }; 
      const createdGroup = await createGroup(groupData);
      console.log("Group created:", createdGroup);
    } catch (error) {
      console.error("Error creating group:", error);
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
    </div>
  );
}

export default Group;
