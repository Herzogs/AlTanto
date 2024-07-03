import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import RegisterForm from '@components/auth/RegisterForm';

// Mockear funciones y componentes


vi.mock('@services/sendData', () => ({
    registerUser: vi.fn(),
}));

vi.mock('react-google-recaptcha', () => ({
    default: ({ onChange }) => (
        <input type="text" onChange={(e) => onChange(e.target.value)} />
    ),
}));

vi.mock('@components/modal/ModalAT', () => ({
    default: vi.fn(({ title, message, showModal, setShowModal, url }) => (
        showModal && (
            <div data-testid="modal-content">
                <div>{title}</div>
                <div>{message}</div>
            </div>
        )
    )),
}));

describe('RegisterForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the registration form correctly', () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );
        waitFor(() => {
            expect(screen.getByText('Registrarse')).toBeInTheDocument();
            expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
            expect(screen.getByLabelText('Apellido:')).toBeInTheDocument();
            expect(screen.getByLabelText('Nombre de usuario:')).toBeInTheDocument();
            expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
            expect(screen.getByLabelText('Ingrese nuevamente la contraseña:')).toBeInTheDocument();
            expect(screen.getByLabelText('Numero de telefono:')).toBeInTheDocument();
            expect(screen.getByLabelText('Email:')).toBeInTheDocument();
            expect(screen.getByText('Enviar')).toBeInTheDocument();
        });
    });

    it('should display errors for empty fields on form submit', async () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );

        // Hace clic en el botón de enviar para intentar enviar el formulario
        fireEvent.click(screen.getByText('Enviar'));

        // Espera a que se muestren los mensajes de error
        waitFor(() => {
            expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
            expect(screen.getByText('El apellido es requerido')).toBeInTheDocument();
            expect(screen.getByText('El nombre de usuario es requerido')).toBeInTheDocument();
            expect(screen.getByText('El campo de contraseña es requerido')).toBeInTheDocument();
            expect(screen.getByText('El numero de telefono solo puede contener numeros')).toBeInTheDocument();
            expect(screen.getByText('El correo electrónico no es válido')).toBeInTheDocument();
        });
    });


    it('should display errors for empty fields on form submit', async () => {
        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );
        const formData = {
            name: 'gabriel',
            lastName: 'gabriel',
            username: 'gabriel',
            password: 'Password123', // Cambio hecho para simular contraseña ingresada
            rePassword: 'Password123', // Cambio hecho para simular contraseña ingresada
            phoneNumber: '1160606060',
            email: 'gabriel@gabriel.com',
        };

        fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: formData.name } });
        fireEvent.change(screen.getByLabelText('Apellido:'), { target: { value: formData.lastName } });
        fireEvent.change(screen.getByLabelText('Nombre de usuario:'), { target: { value: formData.username } });
        fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: formData.password } });
        fireEvent.change(screen.getByLabelText('Ingrese nuevamente la contraseña:'), { target: { value: formData.rePassword } });
        fireEvent.change(screen.getByLabelText('Numero de telefono:'), { target: { value: formData.phoneNumber } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: formData.email } });

        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => {
            expect(screen.queryByText('El nombre es requerido')).toBeNull();
            expect(screen.queryByText('El apellido es requerido')).toBeNull();
            expect(screen.queryByText('El nombre de usuario es requerido')).toBeNull();
            expect(screen.queryByText('El campo de contraseña es requerido')).toBeNull();
            expect(screen.queryByText('El numero de telefono solo puede contener numeros')).toBeNull();
            expect(screen.queryByText('El correo electrónico no es válido')).not.toBeInTheDocument();
        });
    });


    it('should display errors captcha ', async () => {
        vi.mock('react-google-recaptcha', () => ({
            default: ({ onChange }) => (
                <input type="text" onChange={(e) => onChange(e.target.value)} />
            ),
            executeAsync: () => Promise.resolve({ success: false }), // Simula que el captcha no se ha completado correctamente
        }));

        render(
            <MemoryRouter>
                <RegisterForm />
            </MemoryRouter>
        );
        const formData = {
            name: 'gabriel',
            lastName: 'gabriel',
            username: 'gabriel',
            password: 'Password123', // Cambio hecho para simular contraseña ingresada
            rePassword: 'Password123', // Cambio hecho para simular contraseña ingresada
            phoneNumber: '1160606060',
            email: 'gabriel@gabriel.com',
        };

        fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: formData.name } });
        fireEvent.change(screen.getByLabelText('Apellido:'), { target: { value: formData.lastName } });
        fireEvent.change(screen.getByLabelText('Nombre de usuario:'), { target: { value: formData.username } });
        fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: formData.password } });
        fireEvent.change(screen.getByLabelText('Ingrese nuevamente la contraseña:'), { target: { value: formData.rePassword } });
        fireEvent.change(screen.getByLabelText('Numero de telefono:'), { target: { value: formData.phoneNumber } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: formData.email } });

        fireEvent.click(screen.getByText('Enviar'));
        await waitFor(() => {
            expect(screen.queryByText('* Error al crear el usuario')).toBeInTheDocument();
        });
    });

    it('should display register success message on successful registration', async () => {
        vi.mock('react-google-recaptcha', () => ({
          default: ({ onChange }) => (
            <input type="text" onChange={(e) => onChange(e.target.value)} />
          ),
          executeAsync: () => Promise.resolve({ success: true }), // Simulate captcha success
        }));
    
        vi.mock('@services/sendData', () => ({
          registerUser: vi.fn(async (userData) => {
            return Promise.resolve({ status: 201, data: { message: 'Usuario registrado exitosamente' } });
          }),
        }));
    
        render(
          <MemoryRouter>
            <RegisterForm />
          </MemoryRouter>
        );
    
        const formData = {
          name: 'gabriel',
          lastName: 'gabriel',
          username: 'gabriel',
          password: 'Password123',
          rePassword: 'Password123',
          phoneNumber: '1160606060',
          email: 'gabriel@gabriel.com',
        };
    
        fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: formData.name } });
        fireEvent.change(screen.getByLabelText('Apellido:'), { target: { value: formData.lastName } });
        fireEvent.change(screen.getByLabelText('Nombre de usuario:'), { target: { value: formData.username } });
        fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: formData.password } });
        fireEvent.change(screen.getByLabelText('Ingrese nuevamente la contraseña:'), { target: { value: formData.rePassword } });
        fireEvent.change(screen.getByLabelText('Numero de telefono:'), { target: { value: formData.phoneNumber } });
        fireEvent.change(screen.getByLabelText('Email:'), { target: { value: formData.email } });
    
        fireEvent.click(screen.getByText('Enviar'));
    
         waitFor(() => {
            expect(screen.findByText('Usuario registrado exitosamente')).toBeInTheDocument();
            expect(screen.findByText('Registro de usuario')).toBeInTheDocument();
        });

      });

});
