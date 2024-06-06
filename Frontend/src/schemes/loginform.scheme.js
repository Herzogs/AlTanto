import {z} from 'zod';

const loginForm= z.object({
    email: z.string()
        .email('Invalid email format detected'),
    password: z.string()
        .equal('','Password cannot be empty')
        .max(22, 'It cannot be more than 22 characters')
        .min(8, 'cannot be less than 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'must have at least one uppercase letter, one lowercase letter, and one number')

}).strict();

export default loginForm;