
// src/models/TraficoWaze.Model.ts
import TraficoWazeApiServices from "../services/TraficoWazeApiServices";
import reports from '../../../Backend/src/repository/reports.repository'

async function initializeTraficoWazeModel() {
  console.log("initializeTraficoWazeModel");

  try {
    const data = await TraficoWazeApiServices();
    const entity = data?.alerts
    if (entity) {
      for (const item of entity) {

        const nThumbsUp = item.nThumbsUp;
        const type = item.type;
        const uuid = item.uuid;
        const subtype = item.subtype;
        const additionalInfo = item.additionalInfo;
        const wazeData = item.wazeData;
        const location = item.location;
        const id = item.id;
        const pubMillis = item.pubMillis;
        const coordenadaX = item.location.x;
        const coordenadaY = item.location.y;

        console.log(nThumbsUp);
        console.log(type);
        console.log(uuid);
        console.log(subtype);
        console.log(additionalInfo);
        console.log(wazeData);
        console.log(location);
        console.log(id);
        console.log(pubMillis);
        console.log(coordenadaX);
        console.log(coordenadaY);
      }
      // crear reporte;
      //reports.create();4
    }

  } catch (error) {
    console.error('Error al inicializar el modelo TraficoWAze', error);
  }
}


export default initializeTraficoWazeModel;
