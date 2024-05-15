const API_URL = 'http://localhost:3000/api/category';

export const getCategoryFromApi = async () => {
    try {
      const response = await fetch(`${API_URL}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };