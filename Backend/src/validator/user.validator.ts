import * as z from 'zod';

const createUser = z.object({
    email: z.string()
        .email('Invalid email format detected'),
    password: z.string()
        .max(22, 'It cannot be more than 22 characters')
        .min(8, 'cannot be less than 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'must have at least one uppercase letter, one lowercase letter, and one number'),
    name: z.string().min(1, 'Name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    username: z.string().min(1, 'Username is required'),
    phoneNumber: z.string()
        .regex(/^\d+$/, 'Phone number must contain only digits')
        .min(10, 'Phone number must be at least 10 digits long')
}).strict();

const login = z.object({
    email: z.string()
        .email('Invalid email format detected'),
    password: z.string()
        .max(22, 'It cannot be more than 22 characters')
        .min(8, 'cannot be less than 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'must have at least one uppercase letter, one lowercase letter, and one number')

}).strict();

const updatePassword = z.object({
    email: z.string()
        .email('Invalid email format detected'),
    password: z.string()
        .max(22, 'It cannot be more than 22 characters')
        .min(8, 'cannot be less than 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'must have at least one uppercase letter, one lowercase letter, and one number'),
    code: z.string().min(4, 'Code is required'),
})

export { createUser, login, updatePassword };
