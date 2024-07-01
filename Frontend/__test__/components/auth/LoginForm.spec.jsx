import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import LoginForm from '@components/auth/LoginForm';
import userEvent from '@testing-library/user-event'; 

vi.mock('@store', () => ({
    userStore: () => ({
        setToken: vi.fn(),
        setUser: vi.fn(),
    }),
}));

vi.mock('@components/modal/ModalAT', () => ({
    default: vi.fn(({ message }) => <div data-testid="modal-content">{message}</div>),
}));

vi.mock('@hookform/resolvers/zod', () => ({
    zodResolver: vi.fn(),
}));

vi.mock('@components/header/HeaderHome', () => ({
    default: () => <div>HeaderHome</div>,
}));

describe('LoginForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks(); 
    });

    it('should render the login form correctly', () => {
        render(<LoginForm />);
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
        expect(screen.getByLabelText('Correo Electrónico:')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Registrarse/i })).toBeInTheDocument();
    });

    // Add more tests for login form behavior
});
