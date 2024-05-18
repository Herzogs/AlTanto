
async function SearchEvents(location) {

  try {
    const response = await fetch(`http://localhost:3000/buscar?lat=${location.lat}&lon=${location.lon}`);
   
    if (!response.ok) {
      throw new Error('Error al obtener los datos de coordenadas');
    }
    const data = await response.json();
   //console.log('Datos de coordenadas obtenidos:', data);

    return data;
  } catch (error) {
   // console.error('Error al obtener los datos de coordenadas:', error);
    return [];
  }

}

export default SearchEvents;