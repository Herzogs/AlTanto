import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (_req, file, cb) => {
    const uniqueID = uuidv4()
    cb(null, `${file.fieldname}-${uniqueID}`)
  }
})

const upload = multer({ storage })

export { upload }