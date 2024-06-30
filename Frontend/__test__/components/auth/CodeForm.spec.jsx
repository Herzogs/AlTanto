import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import ValidationCodeForm from '@components/auth/CodeForm';
import userEvent from '@testing-library/user-event'; // Asegúrate de importar userEvent correctamente
import { validateCode } from "@services/sendData";

// Mock de los componentes internos
vi.mock('@components/modal/ModalAT', () => ({
    default: vi.fn(({ message }) => <div data-testid="modal-content">{message}</div>),
}));

vi.mock('@components/header/Header', () => ({
    default: () => <div>Header</div>,
}));

vi.mock('@services/sendData', () => ({
    validateCode: vi.fn(),
}));

describe('ValidationCodeForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Limpiar todos los mocks antes de cada prueba
    });

    it('should render the form correctly', () => {
        render(<ValidationCodeForm />);
        expect(screen.getByText('Validar Código')).toBeInTheDocument();
        expect(screen.getByText('Email:')).toBeInTheDocument();
        expect(screen.getByText('Código:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Validar/i })).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
        render(<ValidationCodeForm />);

        fireEvent.click(screen.getByRole('button', { name: /Validar/i }));

        await waitFor(() => {
            const errors = screen.getAllByText('Campo requerido');
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    it('should show validation error for invalid email', async () => {
        render(<ValidationCodeForm />);
        await userEvent.type(screen.getByLabelText('Email:'), '1234');
        fireEvent.click(screen.getByRole('button', { name: /Validar/i }));
        await waitFor(() => {
            expect(screen.getByText('Debe ser una dirección de correo electrónico válida')).toBeInTheDocument();
        });
    });

    it('should show validation error for invalid Code', async () => {
        render(<ValidationCodeForm />);
        await userEvent.type(screen.getByLabelText('Código:'), '1234');
        fireEvent.click(screen.getByRole('button', { name: /Validar/i }));
        await waitFor(() => {
            expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
        });
        await userEvent.type(screen.getByLabelText('Código:'), '1234567');
        fireEvent.click(screen.getByRole('button', { name: /Validar/i }));
        await waitFor(() => {
            expect(screen.getByText('Máximo 6 caracteres')).toBeInTheDocument();
        });
    });

    it('should submit form successfully with valid email and code', async () => {
        validateCode.mockResolvedValueOnce({
            success: true,
            message: 'Sera redirigido a la home del sitio',
        })
           

        render(<ValidationCodeForm />);
        
        await userEvent.type(screen.getByLabelText('Email:'), 'test@example.com');
        await userEvent.type(screen.getByLabelText('Código:'), '123456');
      
        fireEvent.click(screen.getByRole('button', { name: /Validar/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Sera redirigido a la home del sitio')).toBeInTheDocument();
        });
    });

    it('should handle error from validateCode', async () => {
        vi.mock('@services/sendData', () => ({
            validateCode: vi.fn(() => {
                return Promise.reject(new Error('Error de servicio'));
            }),
        }));
        
        render(<ValidationCodeForm />);
        
        await userEvent.type(screen.getByLabelText('Email:'), 'test@example.com');
        await userEvent.type(screen.getByLabelText('Código:'), '123456');
      
        fireEvent.click(screen.getByRole('button', { name: /Validar/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Error de servicio')).toBeInTheDocument();
        });
    });
   
});
