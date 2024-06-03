import axios from 'axios';

async function notificacionesColectivosCapital() {
    try {
        const data = await obtenerDatosDeAPI();
        const validData = validarRespuesta(data);       
        return validData; 
    } catch (error) {
        manejarError(error);
    }
}

async function obtenerDatosDeAPI() {
    const client_id = '431350e535634502832e3bf55d781f69';
    const client_secret = 'b1E507533480471f8A72032Bb3Ea6ddA';
    const link = `https://apitransporte.buenosaires.gob.ar/colectivos/serviceAlerts?client_id=${client_id}&client_secret=${client_secret}&json=1`;



    try {
        const respuesta = await axios.get(link);
        return respuesta;
    } catch (error) {
        throw new Error(`Error al obtener datos de la API: ${error}`);
    }
}

function validarRespuesta(respuesta: any) {
    if (!respuesta) {
        throw new Error('Error: La respuesta es nula o indefinida');
    }

    if (respuesta.status !== 200) {
        throw new Error(`Error: Estado de respuesta no es 200 OK (${respuesta.status})`);
    }

    const contentType = respuesta.headers['content-type'];
    if (!/^application\/json/.test(contentType)) {
        throw new Error(`Error: Tipo de contenido de respuesta no es JSON (${contentType})`);
    }
    return respuesta.data;
}

function manejarError(error: any) {
    console.error('Error en :', error);
    process.exit(1);
}

export default notificacionesColectivosCapital;
