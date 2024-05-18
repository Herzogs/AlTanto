import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID
};


const FORM_URI = 'http://localhost:3000/api/report/create-report'

const sendReportToBackend = async (data) => {
    console.log(firebaseConfig);

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    // Subir la imagen al Storage de Firebase
    const imageName = `images/${uuidv4()}`
    const storageRef = ref(storage, imageName);

    data.image[0] != null ? uploadBytes(storageRef, data.image[0]) : console.log("no hay imagenes");
    
    //Enviar los datos al backend
    const response = await fetch(`${FORM_URI}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: data.title,
            content: data.content,
            categoryId: data.category,
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString(),
            images: imageName.split('/')[1] ?? '' // Utiliza la imagen en formato Base64
        })
    });

    if (response.ok) {
        alert('Reporte creado correctamente');
    }
    else {
        alert('Error al crear el reporte');
    }
}
export default sendReportToBackend;