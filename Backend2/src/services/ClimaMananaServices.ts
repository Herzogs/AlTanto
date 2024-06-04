import axios from 'axios';

async function climaMananaServices() {
    try {
        const data = await obtenerDatosDeAPI();
        const validData = validarRespuesta(data);       
        return validData; 
    } catch (error) {
        manejarError(error);
    }
}

async function obtenerDatosDeAPI() {
    const link = 'https://ws.smn.gob.ar/map_items/forecast/1';
    try {
        const respuesta = await axios.get(link);
        return respuesta;
    } catch (error) {
        throw new Error(`Error al obtener datos de la Clima HOy: ${error}`);
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

export default climaMananaServices;
