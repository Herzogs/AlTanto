import { z } from 'zod';

const ReportFormScheme = z.object({
  content: z.string({
    required_error: 'El contenido es requerido',
  }).min(10, { message: 'El contenido debe contener al menos 10 caracteres' })
    .max(255, { message: 'El contenido no debe superar los 255 caracteres' }),

  category: z.string({
    required_error: 'La categoría es requerida',
  }).min(1, { message: 'La categoría es requerida' }),

  latitude: z.number({
    required_error: 'La latitud es requerida',
  }),

  longitude: z.number({
    required_error: 'La longitud es requerida',
  })
}).strict();

export default ReportFormScheme;
