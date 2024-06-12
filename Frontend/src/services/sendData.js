import axiosInstance from "@interceptors/axiosConfig";

const FORM_URI_REPORT = "/reports";
const FORM_URI_ROAD = "/road";
const FORM_URI_ZONE = "/zones";
const FORM_URI_REGISTER = "/auth/register";
const VALIDATION_URI = "/auth/validate-code";

const sendReport = async (data) => {
  try {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("categoryId", data.category);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());
    if (data && data.image) formData.append("image", data.image);
    if(data.groupId !== undefined){
      formData.append("groupId", data.groupId);
    }

    const response = await axiosInstance.post(FORM_URI_REPORT, formData, {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      console.log("Se envió reporte correctamente");
    } else {
      console.error("Error al enviar el reporte:", response.error);
    }
  } catch (error) {
    console.error("Error al enviar el reporte:", error);
  }
};

const sendRoute = async ({ data, startAddress, endAddress, startPoint, endPoint, distance, time, id }) => {
  try {
    const res = await axiosInstance.post(FORM_URI_ROAD, {
      "name": data.name,
      "addressOrigin": startAddress,
      "addressDestiny": endAddress,
      "origin": {
        "lat": startPoint.lat.toString(),
        "lng": startPoint.lon.toString()
      },
      "destination": {
        "lat": endPoint.lat.toString(),
        "lng": endPoint.lon.toString()
      },
      "distance": distance,
      "duration": time,
      "user": id
    });
    if (res.status !== 201) {

      return {
        title: "Error al guardar la ruta",
        message: res.message,
      };

    }
    return {
      title: "Ruta guardada",
      message: "Se registraron correctamente los datos.",
    };

  } catch (error) {
    throw new Error("Error al guardar la ruta");
  }
}

const saveZone = async (data, coordinates,id) => {
  try {
    if (!data || !coordinates) throw new Error("Error al guardar la zona");
    const { name, radio } = data;
  

    const zone = {
      name,
      latitude: coordinates.lat.toString(),
      longitude: coordinates.lng.toString(),
      radio: +radio,
      userId: id
    };
    const response = await axiosInstance.post(FORM_URI_ZONE, zone);
    if (response.status !== 201) throw new Error("Error al guardar la zona");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}


const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post(FORM_URI_REGISTER, userData);
    if (response.status !== 201) {
      throw new Error("Error al registrar usuario");
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};


const validateCode = async (data) => {
  try {
    const response = await axiosInstance.post(VALIDATION_URI, data);
    if (response.status !== 201) {
      throw new Error("Error al validar el código");
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { sendReport, sendRoute, saveZone, registerUser, validateCode };
