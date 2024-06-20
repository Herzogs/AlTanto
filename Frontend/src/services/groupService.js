import axiosInstance from "@interceptors/axiosConfig";

export const getGroupsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/group/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching groups by user ID:', error);
    throw new Error('Failed to retrieve user groups.');
  }
};

export const getGroupById = async (groupId) => {
  try {
    const response = await axiosInstance.get(`/group/members/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching group by ID:', error);
    throw new Error('Failed to retrieve group details.');
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await axiosInstance.post(`/group`, groupData);
    if (response.status !== 201) {
      if (response.status === 401) {
        throw new Error('Unauthorized: You are not authorized to create groups.');
      } else {
        throw new Error(`Group creation failed`);
      }
    }
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const findGroupByName = async (groupName) => {
  try {
    const response = await axiosInstance.get(`/group/find/${groupName}`);
    return response.data;
  } catch (error) {
    console.error('Error finding group by name:', error);
    throw new Error('Failed to find group by name.');
  }
};

export const addUserToGroupWithCode = async ({ groupId, userId, groupCode }) => {
  try {
    const response = await axiosInstance.post(`/group/${groupId}/add-user`, { groupId, userId, groupCode });
    return response.data;
  } catch (error) {
    console.error('Error adding user to group:', error);
    throw new Error('Failed to add user to group.');
  }
};

export const removeUserFromGroup = async ({ groupId, userId }) => {
  try {
    const response = await axiosInstance.delete(`/group/${groupId}/remove-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing user from group:', error);
    throw new Error('Failed to remove user from group.');
  }
};

export const deleteGroup = async (groupId) => {
  try {
      const response = await axiosInstance.delete(`/group/${groupId}`);
      return response.data;
  } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group.');
  }
};

