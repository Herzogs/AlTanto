import {z} from 'zod'

const ZoneFormScheme = z.object({
    name: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
    address: z.string().min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
})

export default ZoneFormScheme