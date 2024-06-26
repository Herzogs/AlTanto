import { z } from 'zod';

const ReportFormScheme = z.object({
  content: z.string({
    required_error: 'El contenido es requerido',
  }).min(4, { message: 'El contenido debe contener al menos 4 caracteres' })
    .max(255, { message: 'El contenido no debe superar los 255 caracteres' }),

  category: z.string({
    required_error: 'La categoría es requerida',
  }).min(1, { message: 'La categoría es requerida' }),

}).strict();

export default ReportFormScheme;
