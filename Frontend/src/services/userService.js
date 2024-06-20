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