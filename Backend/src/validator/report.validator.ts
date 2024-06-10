import * as z from 'zod'
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const createReportValidator = z.object({
  content: z.string({
    required_error: 'Content is required',
  }).min(1, { message: 'Content must be at least 1 character long' })
    .max(255, { message: 'Content must be at most 255 characters long' }),
  
  categoryId: z.string({
    required_error: 'CategoryId is required',
  }).min(1, { message: 'CategoryId must be at least 1 character long' })
    .max(10, { message: 'CategoryId must be at most 10 characters long' }),
  
  latitude: z.string({
    required_error: 'Latitude is required',
  }).min(1, { message: 'Latitude must be at least 1 character long' })
    .max(30, { message: 'Latitude must be at most 30 characters long' }),
  
  longitude: z.string({
    required_error: 'Longitude is required',
  }).min(1, { message: 'Longitude must be at least 1 character long' })
    .max(30, { message: 'Longitude must be at most 30 characters long' }),

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



const getReportByIdValidator = z.object({
  id: z.string({
    message: 'Id must be a string',
    required_error: 'Id is required'
  })
    .min(1, { message: 'Id must be at least 1 character long' })
    .max(10, { message: 'Id must be at most 10 characters long' })
})

const getReportByUserIDValidator = z.object({
  userId: z.string({
    message: 'UserId must be a string',
    required_error: 'UserId is required'
  })
    .min(1, { message: 'UserId must be at least 1 character long' })
    .max(10, { message: 'UserId must be at most 10 characters long' })
}).strict()

const getReportByLatLongRadValidator = z.object({
  lat: z.string({
    message: 'Latitude must be a string',
    required_error: 'Latitude is required'
  })
    .min(1, { message: 'Latitude must be at least 1 character long' })
    .max(30, { message: 'Latitude must be at most 30 characters long' }),
  lon: z.string({
    message: 'Longitude must be a string',
    required_error: 'Longitude is required'
  })
    .min(1, { message: 'Longitude must be at least 1 character long' })
    .max(30, { message: 'Longitude must be at most 30 characters long' }),
  rad: z.string({
    message: 'Radius must be a string',
    required_error: 'Radius is required'
  })
    .min(1, { message: 'Radius must be at least 1 character long' })
    .max(30, { message: 'Radius must be at most 30 characters long' })
}).strict()

export { createReportValidator, getReportByIdValidator, getReportByUserIDValidator, getReportByLatLongRadValidator }