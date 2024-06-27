import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import ReportForm from '@components/report/ReportForm';
import { MemoryRouter } from 'react-router-dom';
import { userStore } from '@store';

vi.mock('@components/header/Header', () => ({
  default: () => <div>Header Component</div>,
}));
vi.mock('@components/Map/Map', () => ({
  default: () => <div>Map Component</div>,
}));
vi.mock('@components/modal/ModalAT', () => ({
  default: () => <div>ModalAT Component</div>,
}));
vi.mock('@services/getCategory', () => ({
  getCategoryFromApi: vi.fn(async () => [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ]),
}));
vi.mock('@store', () => ({
  useStore: vi.fn(() => ({
    userLocation: { lat: 10, lng: 20 },
    markerPosition: [10, 20],
    setReports: vi.fn(),
  })),
  userStore: {
    getState: vi.fn(() => ({
      user: { id: 1 },
    })),
  },
}));

describe('ReportForm Component', () => {

  beforeEach(() => {
    userStore.getState.mockReturnValue({
      user: { id: 1 },
    });
  });

  it('renders ReportForm component correctly', async () => {
    render(
      <MemoryRouter>
        <ReportForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Crear Reporte')).toBeInTheDocument();
    expect(screen.getByText('Categoría:')).toBeInTheDocument();
    expect(screen.getByText('Descripción:')).toBeInTheDocument();
    expect(screen.getByText('Ubicación:')).toBeInTheDocument();
    expect(screen.getByText('Imagen:')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });
});
