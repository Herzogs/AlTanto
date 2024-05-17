import * as z from 'zod'

const createReportValidator = z.object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(255),
    images: z.string().min(1).max(255).optional(),
    categoryId: z.string().min(1).max(10),
    latitude: z.string().min(1).max(30),
    longitude: z.string().min(1).max(30),
})

export {createReportValidator}