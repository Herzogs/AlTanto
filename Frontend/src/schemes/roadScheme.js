import { z } from 'zod'

const roadScheme = z.object({
    name: z.string()
        .min(1, { message: 'El nombre es requerido' })
        .max(30, { message: 'El nombre debe ser menor de 30 caracteres' }),
    origin: z.string()
        .min(1, { message: 'El origen es requerido' })
        .max(50, { message: 'El origen debe ser menor a 50 caracteres' }),
    destination: z.string()
        .min(1, { message: 'El destino debe ser requerido' })
        .max(50, { message: 'El destino debe ser requerido' })
}).strict()

export default roadScheme