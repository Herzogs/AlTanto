import * as z from 'zod';

const createZoneValidator = z.object({
    name: z.string({
        message: 'Name must be a string',
        required_error: 'Name is required'
    })
    .min(3)
    .max(100)
    .trim(),
    latitude: z.string(
        {
            message: 'Latitude must be a string',
            required_error: 'Latitude is required'
        }
    ),
    longitude: z.string({
        message: 'Longitude must be a string',
        required_error: 'Longitude is required'
    }),
    radio: z.string({
        message: 'Radio must be a string',
        required_error: 'Radio is required'
    }).min(3).max(4),
}).strict();

const getZoneByIdValidator = z.object({
    id: z.string({
        message: 'Id must be a string',
        required_error: 'Id is required'
    })
    .min(1)
    .max(10)
}).strict();



export {createZoneValidator, getZoneByIdValidator};