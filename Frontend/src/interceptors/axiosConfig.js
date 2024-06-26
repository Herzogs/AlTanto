import axios from 'axios';
import { userStore } from '@/store';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Reemplaza con tu URL base
});

// Agregar un interceptor para incluir el token en cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token de donde lo almacenes (por ejemplo, localStorage)
    const token = userStore.getState().token;
    

    // Si el token existe, agregarlo a la cabecera de la solicitud
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Manejar errores antes de enviar la solicitud
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
  response => {
    // Si la respuesta es exitosa, simplemente retornamos la respuesta
    return response;
  },
  error => {
    // Si la respuesta contiene un error 401, redirigimos al usuario al home
    if (error.response && error.response.status === 401) {
      console.log(error.response)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
