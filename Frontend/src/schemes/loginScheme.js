import {z} from 'zod';

const loginScheme= z.object({
    email: z.string()
        .email('El correo electrónico no es válido'),
    password: z.string()
        .max(22, 'No puede tener más de 22 caracteres')
        .min(1, 'El campo de contraseña es requerido')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'El campo de contraseña debe contener 8 caracteres y al menos una mayúscula, una minúscula y un número')

}).strict();

export default loginScheme;