import axiosInstance from "@interceptors/axiosConfig";

export const getUserByUsername = async (username) => {
    try {
        const response = await axiosInstance.get(`/user/${username}`); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw new Error('Failed to fetch user by username.');
    }
  };

  export const getUserById = async (userId) => {
    try {
        const response = await axiosInstance.get(`/user/id/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user by ID.');
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await axiosInstance.put(`/user/id/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user.');
    }
};