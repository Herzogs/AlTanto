import * as z from 'zod';

const getRoadByIdValidator = z.object({
    id: z.string({
        message: 'Id must be a string',
        required_error: 'Id is required'
    })
        .min(1, { message: 'Id must be at least 1 character long' })
        .max(10, { message: 'Id must be at most 10 characters long' })
}).strict()

const createRoadValidator = z.object({
    name: z.string({
        message: 'Name must be a string',
        required_error: 'Name is required'
    }).min(1, { message: 'Name must be at least 1 character long' })
        .max(30, { message: 'Name must be at most 30 characters long' }),
    addressOrigin: z.string({
        message: 'Address must be a string',
        required_error: 'Address is required'
    }).min(1, { message: 'Address must be at least 1 character long' })
        .max(50, { message: 'Address must be at most 3 characters long' }),
    addressDestiny: z.string({
        message: 'Address must be a string',
        required_error: 'Address is required',
    }).min(1, { message: 'Address must be at least 1 character long' })
        .max(50, { message: 'Address must be at most 30 characters long' }),
    origin: z.object({
        lat: z.string({
            message: 'Latitude must be a number',
            required_error: 'Latitude is required'
        }).min(-90, { message: 'Latitude must be at least -90' })
            .max(200, { message: 'Latitude must be at most 200' }),
        lng: z.string({
            message: 'Longitude must be a number',
            required_error: 'Longitude is required'
        }).min(-180, { message: 'Longitude must be at least -180' })
            .max(200, { message: 'Longitude must be at most 200' }),
    }),
    destination: z.object({
        lat: z.string({
            message: 'Latitude must be a number',
            required_error: 'Latitude is required'
        }).min(-90, { message: 'Latitude must be at least -90' })
            .max(200, { message: 'Latitude must be at most 200' }),
        lng: z.string({
            message: 'Longitude must be a number',
            required_error: 'Longitude is required'
        }).min(-180, { message: 'Longitude must be at least -180' })
            .max(200, { message: 'Longitude must be at most 200' }),
    }),
    distance: z.number({
        message: 'Distance must be a number',
        required_error: 'Distance is required'
    }).min(0, { message: 'Distance must be at least 0' }),
    duration: z.number({
        message: 'Duration must be a number',
        required_error: 'Duration is required'
    }).min(0, { message: 'Duration must be at least 0' }),
    user: z.number({
        message: 'User must be a number',
        required_error: 'User is required'
    }).int(),
}).strict()

const getRoadsByUserIDlValidator = z.object({
    id: z.string({
        message: 'Id must be a string',
        required_error: 'Id is required'
    }).min(1, { message: 'Id must be 1 digits' })

}).strict()

export { getRoadByIdValidator, createRoadValidator, getRoadsByUserIDlValidator }