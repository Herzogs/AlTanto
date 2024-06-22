import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import ReportForm from '@components/report/ReportForm';
import { MemoryRouter } from 'react-router-dom';

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
vi.mock('@services/sendData', () => ({
  sendReport: vi.fn(async (data) => {
    return { success: true };
  }),
}));
vi.mock('@store', () => ({
  useStore: vi.fn(() => ({
    userLocation: { lat: 10, lng: 20 },
    markerPosition: [10, 20],
    setReports: vi.fn(),
  })),
}));

describe('ReportForm Component', () => {
  it('renders ReportForm component correctly', async () => {
    render(
      <MemoryRouter>
        <ReportForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Crear Reporte')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoría:')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción:')).toBeInTheDocument();
    expect(screen.getByLabelText('Ubicación:')).toBeInTheDocument();
    expect(screen.getByLabelText('Imagen:')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });
});