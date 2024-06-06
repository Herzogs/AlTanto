import {z} from 'zod';

const createUser = z.object({
    email: z.string()
        .email('El correo electrónico no es válido'),
    password: z.string()
        .max(22, 'No puede tener más de 22 caracteres')
        .min(8, 'No puede tener menos de 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Debe contener al menos una mayúscula, una minúscula y un número'),
    name: z.string()
    .equals('', 'Nombre es requerido')
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
    lastName: z.string()
    .equals('', 'Apellido es requerido')
    .min(4, 'El apellido debe tener al menos 4 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
    username: z.string()
    .equals('', 'El nombre de usuario es requerido')
    .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres'),
    phoneNumber: z.string()
        .regex(/^\d+$/, 'El numero de telefono solo puede contener numeros')
        .min(10, 'El numero de telefono debe tener al menos 10 caracteres')
}).strict();

export default createUser;