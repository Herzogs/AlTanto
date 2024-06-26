import * as z from 'zod';

const createZoneValidator = z.object({
    name: z.string({
        message: 'Name must be a string',
        required_error: 'Name is required'
    })
    .min(3)
    .max(255)
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
    radio: z.number({
        message: 'Radio must be a number',
        required_error: 'Radio is required'
    }).int().positive(),
    userId: z.number({
        message: 'Id must be a number',
        required_error: 'Id is required'
    }).int().positive()

}).strict();

const getZoneByIdValidator = z.object({
    id: z.string({
        message: 'Id must be a string',
        required_error: 'Id is required'
    })
    .min(1, {message: 'Id must be required'})
    .max(10)
}).strict();

const getNotificationValidator = z.object({
    userId: z.string({
        message: 'Id must be a string',
        required_error: 'Id is required'
    }).min(1).max(10)
}).strict();

const getAllByUserIdValidator = z.object({
    id: z.string({
        message: 'Id must be a string',
        required_error: 'Id is required'
    }).min(1).max(10)
}).strict();

const getFilteredReportsValidator = z.object({
    lat: z.string({
        message: 'Latitude must be a string',
        required_error: 'Latitude is required'
    }),
    lon: z.string({
        message: 'Longitude must be a string',
        required_error: 'Longitude is required'
    }),
    rad: z.string({
        message: 'Radius must be a string',
        required_error: 'Radius is required'
    })
}).strict();


export {createZoneValidator, getZoneByIdValidator, getNotificationValidator, getAllByUserIdValidator, getFilteredReportsValidator};