/*import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (_req, file, cb) => {
    const uniqueID = uuidv4();
    cb(null, `${file.fieldname}-${uniqueID}.${file.mimetype.split('/')[1]}`);
  }
});

const upload = multer({ storage });

export { upload };*/

import multer from 'multer';
//import { v4 as uuidv4 } from 'uuid';

// Configurar el almacenamiento en memoria
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Puedes agregar un filtro de archivos aquí si lo necesitas
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de tamaño del archivo (5MB en este caso)
  }
});

export { upload };