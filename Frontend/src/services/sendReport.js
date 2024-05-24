import axios from "axios";

const FORM_URI = 'http://localhost:3000/api/reports';

const sendReport = async (data) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('categoryId', data.category);
        formData.append('latitude', data.latitude.toString());
        formData.append('longitude', data.longitude.toString());
        
        // Añadir la imagen si está presente
        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }

        const response = await axios.post(FORM_URI, formData, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
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

export default sendReport;
