import * as z from 'zod';

const createZone = z.object({
    name: z.string().min(3).max(255),
    latitude: z.string(),
    longitude: z.string(),
    radio: z.string().min(3).max(4),
});

export {createZone};