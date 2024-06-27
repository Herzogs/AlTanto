import { render, screen, act , waitFor  } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReportIA from '@components/ReportAutomatic/ReportIA';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useStore } from '@store';
import '@testing-library/jest-dom';

vi.mock('@components/Map/Map', () => ({
  default: () => <div>Map Component</div>,
}));

vi.mock("@store", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useStore: vi.fn(),
  };
});

describe('ReportIA Component - Static Content', () => {
  const renderWithRouter = (ui, { route = '/form/reporte/automatico/:groupId?' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    useStore.mockReturnValue({
      userLocation: { lat: 10, lng: 10 },
      markerPosition: null,
      setReports: vi.fn(),
    });

    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/form/reporte/automatico/:groupId?" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

//   it('should render the ReportIA component correctly', () => {
//     renderWithRouter(<ReportIA />);

//     expect(screen.getByText('Generar reporte automático')).toBeInTheDocument();
//     expect(screen.getByText('Usar mi cámara')).toBeInTheDocument();
//     expect(screen.getByText('Regresar')).toBeInTheDocument();
//     expect(screen.getByText('Categoría:')).toBeInTheDocument();
//     expect(screen.getByText('Descripción:')).toBeInTheDocument();
//     expect(screen.getByText('Ubicación:')).toBeInTheDocument();
//     expect(screen.getByText('Guardar reporte')).toBeInTheDocument();
//   });

  it('should render the back button correctly', () => {
    renderWithRouter(<ReportIA />);

    expect(screen.getByText('Regresar')).toBeInTheDocument();
  });

// it('should render the default category correctly', async () => {
//     await act(async () => {
//       renderWithRouter(<ReportIA />);
//     });

//     await waitFor(() => {
//         expect(screen.getByText('Categoría:')).toBeInTheDocument();
//         expect(screen.getByText('Alerta')).toBeInTheDocument();
//     });
// });


//   it('should render the description input correctly', async () => {
//     renderWithRouter(<ReportIA />);

//     await waitFor(() => {
//       expect(screen.getByLabelText('Descripción:')).toBeInTheDocument();
//     });

//     expect(screen.getByText('Descripción:')).toBeInTheDocument();

//     const descriptionInput = screen.getByLabelText('Descripción:');
//     fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
//     expect(descriptionInput.value).toBe('Test description');
//   });

//   it('should render the default location correctly', () => {
//     renderWithRouter(<ReportIA />);

//     expect(screen.getByText('Ubicación:')).toBeInTheDocument();
//     expect(screen.getByText('Test Address')).toBeInTheDocument(); // Ubicación simulada 'Test Address'
//   });

//   it('should render the save report button correctly', () => {
//     renderWithRouter(<ReportIA />);

//     expect(screen.getByText('Guardar reporte')).toBeInTheDocument();
//   });
});
