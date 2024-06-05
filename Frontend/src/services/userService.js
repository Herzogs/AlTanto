import axiosInstance from "@interceptors/axiosConfig";

const baseURL = 'http://localhost:3000/api'; 

export const getUserByUsername = async (username) => {
    try {
      console.log(username)
        const response = await axiosInstance.get(`${baseURL}/user/${username}`); 
        return response.data; 
    } catch (error) {
        console.error('Error fetching user by username:', error);
        throw new Error('Failed to fetch user by username.');
    }
  };