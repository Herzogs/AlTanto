import { z } from 'zod'

const roadScheme = z.object({
    name: z.string()
        .min(1, { message: 'El nombre es requerido' })
        .max(120, { message: 'El nombre debe ser menor de 120 caracteres' }),
    origin: z.string()
        .min(1, { message: 'El origen es requerido' })
        .max(120, { message: 'El origen debe ser menor a 120 caracteres' }),
    destination: z.string()
        .min(1, { message: 'El destino debe ser requerido' })
        .max(50, { message: 'El destino debe ser requerido' })
}).strict()

export default roadScheme