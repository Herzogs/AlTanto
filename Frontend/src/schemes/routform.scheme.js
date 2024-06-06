import { z } from 'zod'

const RoutFormScheme = z.object({
    name: z.string()
        .min(3, { message: 'Name must be at least 3 character long' })
        .max(30, { message: 'Name must be at most 30 characters long' }),
    origin: z.string()
        .min(1, { message: 'Address must be at least 1 character long' })
        .max(50, { message: 'Address must be at most 3 characters long' }),
    destination: z.string()
        .min(1, { message: 'Address must be at least 1 character long' })
        .max(50, { message: 'Address must be at most 30 characters long' })
}).strict()

export default RoutFormScheme