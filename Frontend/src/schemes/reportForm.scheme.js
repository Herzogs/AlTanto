import { z } from 'zod'

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB en bytes
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ReportFormScheme = z.object({
    content: z.string({
        required_error: 'Content is required',
    }).min(1, { message: 'Content must be at least 1 character long' })
        .max(255, { message: 'Content must be at most 255 characters long' }),

    category: z.string()
        .min(1, { message: 'Category is required' }),

    latitude: z.number()
        .min(-90, { message: 'Latitude must be at least -90' })
        .max(90, { message: 'Latitude must be at most 90' }),

    longitude: z.number()
    .min(-90, { message: 'Latitude must be at least -90' })
    .max(90, { message: 'Latitude must be at most 90' }),

    image: z.object({
        adImage: z.array(z.any()).optional().refine((files) => {
            if (!files || files.length === 0) return true; // Es opcional
            return files[0].size <= MAX_FILE_SIZE;
        }, `Max image size is 5MB.`).refine((files) => {
            if (!files || files.length === 0) return true; // Es opcional
            return ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type);
        }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    }).optional().nullable()
}).strict();

export default ReportFormScheme;