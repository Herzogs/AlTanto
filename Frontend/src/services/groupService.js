const API_URL = "http://localhost:3000/api/group";

export const getGroupsByUserId = async (userId) => {
  try {
    console.log(userId)
    const response = await fetch(`${API_URL}/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching groups by user ID:", error);
    return [];
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};
