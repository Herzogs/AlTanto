import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HeaderHome from '@components/header/HeaderHome';

vi.mock('@assets/logo-altanto.png', () => ({
    __esModule: true,
    default: 'mockLogoPath',
}));



describe('HeaderHome Component', () => {
    it('renders correctly when user is not authenticated', () => {
        render(
            <MemoryRouter>
                <HeaderHome />
            </MemoryRouter>
        );
        waitFor(() => {
            expect(screen.getByAltText('Logo Al Tanto')).toBeInTheDocument();
            expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
            expect(screen.getByText('Cerrar sesión')).not.toBeInTheDocument();
        });
    });
});
