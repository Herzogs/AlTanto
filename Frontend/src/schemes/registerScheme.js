import { z } from 'zod';

const createUser = z.object({
  email: z.string()
    .email('El correo electrónico no es válido'),
  password: z.string()
    .max(22, 'No puede tener más de 22 caracteres')
    .min(1, 'El campo de contraseña es requerido')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Debe contener 8 caracteres y al menos una mayúscula, una minúscula y un número'),
  rePassword: z.string()
    .max(22, 'No puede tener más de 22 caracteres')
    .min(1, 'El campo de contraseña es requerido')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Debe contener 8 caracteres y al menos una mayúscula, una minúscula y un número'),
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  lastName: z.string()
    .min(1, 'El apellido es requerido')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  username: z.string()
    .min(1, 'El nombre de usuario es requerido')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres'),
  phoneNumber: z.string()
    .regex(/^\d+$/, 'El numero de telefono solo puede contener numeros')
    .min(1, 'El numero de telefono es requerido')
    .regex(/^[0-9]{10}$/, 'El número de teléfono debe tener 10 dígitos')
}).superRefine((data, ctx) => {
  if (data.password !== data.rePassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Las contraseñas no coinciden',
      path: ['rePassword'],
    });
  }
});

export default createUser;
