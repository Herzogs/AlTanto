import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '@components/auth/LoginForm';

const mockSetToken = vi.fn();
const mockSetUser = vi.fn();

vi.mock('@store', () => ({
    userStore: () => ({
        setToken: mockSetToken,
        setUser: mockSetUser,
    }),
}));

const mockLoginUser = vi.fn().mockResolvedValue({
    token: 'fakeToken',
    user: { id: 1, name: 'John Doe' },
});

vi.mock('@services/login.js', () => ({
    default: mockLoginUser,
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

vi.mock('@components/header/Header', () => ({
    default: () => <div>Header</div>,
}));

describe('LoginForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the login form correctly', () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        waitFor(() => {
            expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
            expect(screen.getByLabelText('Correo Electrónico:')).toBeInTheDocument();
            expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Registrarse/i })).toBeInTheDocument();
        });
    });

  
    it('should call setToken and setUser on successful form submission', async () => {
        const loginUser = vi.fn();
        vi.mock('@services/login.js', () => ({
            loginUser: vi.fn().mockResolvedValue({
                token: 'fakeToken',
                user: { id: 1, name: 'John Doe' },
            }),
        }));
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Correo Electrónico:'), { target: { value: 'email@email.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'Password123' } });
        fireEvent.submit(screen.getByRole('button', { name: /Iniciar Sesión/i }));

         waitFor(() => {
            expect(loginUser).toHaveBeenCalled();
            expect(mockSetToken).toHaveBeenCalledWith('fakeToken');
            expect(mockSetUser).toHaveBeenCalledWith({ id: 1, name: 'John Doe' });
            expect(screen.getByTestId('modal-content')).toBeInTheDocument();
            expect(screen.getByText('Logeo exitoso')).toBeInTheDocument();
            expect(screen.getByText('Será redirigido a la home del sitio')).toBeInTheDocument();
        });
    });
    
    it('should navigate to registration page when "Registrarse" link is clicked', () => {
        const historyMock = { push: vi.fn() };

        render(
            <MemoryRouter>
                <LoginForm history={historyMock} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('link', { name: /Registrarse/i }));

        waitFor(() => {
            expect(historyMock.push).toHaveBeenCalledWith('/auth/registro');
        });
    });

    it('should display error message on invalid email input', async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.input(screen.getByLabelText('Correo Electrónico:'), {
            target: { value: 'invalid-email' },
        });

        fireEvent.input(screen.getByLabelText('Contraseña:'), {
            target: { value: 'Pasword123' },
        });

        fireEvent.submit(screen.getByRole('button', { name: /Iniciar Sesión/i }));

        await waitFor(() => {
            expect(screen.getByText('El correo electrónico no es válido')).toBeInTheDocument();
        });
    });

    it('should display error message on invalid password input', async () => {
        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.input(screen.getByLabelText('Correo Electrónico:'), {
            target: { value: 'test@example.com' },
        });

        fireEvent.input(screen.getByLabelText('Contraseña:'), {
            target: { value: 'pass' }, // Password inválido que no cumple con las reglas
        });

        fireEvent.submit(screen.getByRole('button', { name: /Iniciar Sesión/i }));

        await waitFor(() => {
            expect(screen.getByText('El campo de contraseña debe contener 8 caracteres y al menos una mayúscula, una minúscula y un número')).toBeInTheDocument();
        });
    });

    it('should display generic error message on login failure', async () => {
        vi.mock('@services/login.js', () => ({
            default: vi.fn().mockRejectedValue(new Error('Error de login')),
        }));

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.input(screen.getByLabelText('Correo Electrónico:'), {
            target: { value: 'test@example.com' },
        });

        fireEvent.input(screen.getByLabelText('Contraseña:'), {
            target: { value: 'Password123' },
        });

        fireEvent.submit(screen.getByRole('button', { name: /Iniciar Sesión/i }));

        await waitFor(() => {
            expect(screen.getByText('* Error al procesar los datos')).toBeInTheDocument();
        });
    });
});
