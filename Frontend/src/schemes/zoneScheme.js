import {z} from 'zod'

const ZoneFormScheme = z.object({
    name: z.string({
        required_error: 'El nombre es requerido'
    })
    .min(5, 'Mínimo debe contener 10 caracteres')
    .max(100, 'Máximo 100 caracteres'),
    address: z.string({
        required_error: 'La dirección es requerida'
    }).min(3, 'Mínimo 3 caracteres').max(255, 'Máximo 255 caracteres'),
    radio: z.string({
        required_error: 'Debe seleccionar un radio'
    })
})

export default ZoneFormScheme