import axiosInstance from "@interceptors/axiosConfig";
const API_URL = "/categories";

export const getCategoryFromApi = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    if(response.status !== 200) {
      throw new Error("Error fetching categories");
    }
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
