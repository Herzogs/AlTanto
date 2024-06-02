import * as z from 'zod';

const getGroupByIdValidator = z.object({
    id: z.string({
        required_error: "id is required",
        invalid_type_error: "id must be a string",
    })
    .regex(/^[0-9]+$/, { message: "id must be a number" })
    .trim()
}).strict();

const createGroupValidator = z.object({
    name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be a string",
    }).trim()
    .min(3, { message: "name should be at least 3 characters long" })
    .max(255, { message: "name should be at most 255 characters long" }),
    ownerId: z.number({
        required_error: "ownerId is required",
        invalid_type_error: "ownerId must be a number",
    })
}).strict();

export { getGroupByIdValidator, createGroupValidator };
