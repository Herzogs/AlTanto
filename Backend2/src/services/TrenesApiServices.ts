import axios from 'axios';
import cheerio from 'cheerio';

interface AlertaData {
    type: string;
    message: string;
}

interface LineaData {
    name: string;
    alerts: AlertaData[];
}

async function TrenesApiServices() {
    const url = 'https://www.argentina.gob.ar/transporte/trenes-argentinos/modificaciones-en-el-servicio-y-novedades'; 

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const lineas: LineaData[] = [];

        // Encuentra todas las secciones de detalles de línea
        $('details').each((index, element) => {
            const nombreLinea = $(element).find('summary').text().trim();
            const alertas: AlertaData[] = [];

            // Encuentra todas las alertas dentro de la sección de detalles
            $(element).find('.alert').each((i, el) => {
                const tipo = $(el).attr('class')?.split(' ')[1].replace('alert-', '') || '';
                const mensaje = $(el).find('.media-body').text().trim();

                alertas.push({ type: tipo, message: mensaje });
            });

            lineas.push({ name: nombreLinea, alerts: alertas });
        });


        return lineas;
    } catch (error) {
        console.error('Error al hacer scraping en TrenesApiServices:', error);
        throw error;
    }
}

export default TrenesApiServices;
