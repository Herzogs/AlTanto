export async function getReportsBy(location, radius) {
  const API_URL = `http://localhost:3000/api/reports/filterBy?lat=${location.lat}&lon=${location.lng}&rad=${radius}`;
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener los datos ");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
