import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RoadID from '@components/road/RoadID';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useStore } from '@store';
import { fetchReports } from '@services/getReportsInRoutings';
import { getDataOfRoadById } from '@services/getRoutesByUser';
import '@testing-library/jest-dom';


// Mocking the necessary services and hooks
vi.mock('@store', () => ({
  useStore: vi.fn(),
}));

vi.mock('@services/getReportsInRoutings', () => ({
  fetchReports: vi.fn(),
}));

vi.mock('@services/getRoutesByUser', () => ({
  getDataOfRoadById: vi.fn(),
}));

vi.mock('@changey/react-leaflet-markercluster', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('RoadID Component', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      routeCoordinates: [],
      userLocation: null,
      setUserLocation: vi.fn(),
      reports: [],
      setReports: vi.fn(),
    });

    getDataOfRoadById.mockResolvedValue({
      status: 200,
      data: {
        name: 'Test Road',
        origin: { lat: 10, lng: 10 },
        addressOrigin: 'Test Origin Address',
        addressDestiny: 'Test Destination Address',
        destination: { lat: 20, lng: 20 },
        distance: 1000,
      }
    });

    fetchReports.mockResolvedValue([]);
  });

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/recorridos/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render the road information correctly', async () => {
    renderWithRouter(<RoadID />, { route: '/recorridos/1' });

    await waitFor(() => {
      expect(screen.getByText('Test Road')).toBeInTheDocument();
      expect(screen.getByText('Orien:')).toBeInTheDocument();
      expect(screen.getByText('Destino:')).toBeInTheDocument();
      expect(screen.getByText('Distancia')).toBeInTheDocument();
    });
  });

  it('should show error toast if no data found', async () => {
    getDataOfRoadById.mockRejectedValueOnce(new Error('No se encontraron datos'));

    renderWithRouter(<RoadID />, { route: '/recorridos/2' });

    await waitFor(() => {
      expect(screen.getByText("No se encontraron datos")).toBeInTheDocument();
    });
  });

  it('should call fetchReports when routeCoordinates are set', async () => {
    useStore.mockReturnValueOnce({
      routeCoordinates: [{ lat: 10, lng: 10 }],
      userLocation: null,
      setUserLocation: vi.fn(),
      reports: [],
      setReports: vi.fn(),
    });

    renderWithRouter(<RoadID />, { route: '/recorridos/3' });

    await waitFor(() => {
      expect(fetchReports).toHaveBeenCalled();
    });
  });
});
