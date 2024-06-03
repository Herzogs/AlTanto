import axiosInstance from "@interceptors/axiosConfig";

const FORM_URI = "/zones";

const saveZone = async (data, coordinates) => {
    
    try {
        if(!data || !coordinates) throw new Error("Error al guardar la zona");
        const { name, radio } = data;
        
        const zone = {
            name,
            latitude: coordinates.lat.toString(),
            longitude: coordinates.lng.toString(),
            radio,
        };
        const response = await axiosInstance.post(FORM_URI, zone);
        if(response.status !== 201) throw new Error("Error al guardar la zona");
        return response.data;
    } catch (error) {
       throw new Error(error.message);
    }
}

export default saveZone;