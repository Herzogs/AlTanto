import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
    apiKey: "AIzaSyDiUS_XPySIUMlJqLQpqOGYthED9QbLcTQ",
    authDomain: "altantotest.firebaseapp.com",
    projectId: "altantotest",
    storageBucket: "altantotest.appspot.com",
    messagingSenderId: "664163745038",
    appId: "1:664163745038:web:fb6282046fd9be23d6ab5f"
};

// Initialize Firebase

const FORM_URI = 'http://localhost:3000/api/report/create-report'

const sendReportToBackend = async (data) => {

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    // Subir la imagen al Storage de Firebase
    const imageName = `images/${uuidv4()}`
    const storageRef = ref(storage, imageName);

    const uploadTask = uploadBytes(storageRef, data.image[0]);
    console.log('Imagen subida correctamente');
    console.log(uploadTask);
    //Enviar los datos al backend
    const response = await fetch(`${FORM_URI}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: data.description,
            categoryId: +data.category,
            latitude: data.latitude,
            longitude: data.longitude,
            image: imageName,// Utiliza la imagen en formato Base64
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