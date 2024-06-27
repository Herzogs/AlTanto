import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import axiosInstance from "@interceptors/axiosConfig";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID
};

const getImages = async (images) => {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const storageRef = ref(storage, images);

  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error fetching download URL:", error.message);
    throw error;
  }
};

export async function fetchReportById(id) {
  try {
    const response = await axiosInstance.get(`/reports/${id}`);
    if (response.status !== 200) {
      throw new Error("Error al obtener el reporte");
    }
    const data = await response.data;
    if (data.images !== null) {
      data.images = await getImages(data.images);
    }
    return data;
  } catch (error) {
    console.error("Error fetching report:", error.message);
    throw new Error(error);
  }
}
