//  /database/modelsInitializer.ts
import   '../models/EstacionMeteorologica';
import DescripcionClima from '../models/DescripcionClima'; 
import '../models/Alerta';
import '../models/TipoNotificacion';


async function initializeModels(){  
    await DescripcionClima.initialize(); // Espera a que se complete la inicialización
  }
    
 export default initializeModels ;
