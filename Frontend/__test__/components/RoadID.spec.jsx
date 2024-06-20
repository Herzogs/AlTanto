import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import RoadID from '@components/road/RoadID';
import { fetchReports } from '@services/getReportsInRoutings';
import { getDataOfRoadById } from '@services/getRoutesByUser';
import { useStore } from '@store';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Mock de servicios y stores utilizados en RoadID
vi.mock('@services/getReportsInRoutings', () => ({
  fetchReports: vi.fn(),
}));
vi.mock('@services/getRoutesByUser', () => ({
  getDataOfRoadById: vi.fn(),
}));
vi.mock('@store', () => ({
  useStore: {
    getState: vi.fn(),
    setReports: vi.fn(),
  },
}));

vi.mock('@changey/react-leaflet-markercluster', () => ({
    default: ({ children }) => <div>{children}</div>,
}));

describe('RoadID component', () => {
  beforeEach(() => {
    useStore.getState.mockReturnValue({
      routeCoordinates: [{ lat: 40.7128, lng: -74.0060 }],
      userLocation: { lat: 40.7128, lng: -74.0060 },
      setUserLocation: vi.fn(),
      reports: [],
      setReports: vi.fn(),
    });

    getDataOfRoadById.mockResolvedValue({
      name: 'Ruta 1',
      origin: { lat: 40.7128, lng: -74.0060 },
      addressOrigin: '123 Main St',
      addressDestiny: '456 Elm St',
      destination: { lat: 40.7138, lng: -74.0070 },
      distance: 1000,
    });

    fetchReports.mockResolvedValue([]);
  });

  

  it('renders the RoadID component correctly', async () => {
    render(
        <Router>
          <Route path="/road/1">
            <RoadID />
          </Route>
        </Router>
      );

    await waitFor(() => {
      expect(screen.getByText('Ruta 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Origen: 123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Destino: 456 Elm St')).toBeInTheDocument();
    expect(screen.getByText('Distancia: 1 km')).toBeInTheDocument();
  });

  it('handles data fetching and state updates correctly', async () => {
    render(
        <Router>
          <Route path="/road/1">
            <RoadID />
          </Route>
        </Router>
      );

    await waitFor(() => {
      expect(getDataOfRoadById).toHaveBeenCalledWith('1');
    });

    await waitFor(() => {
      expect(fetchReports).toHaveBeenCalledWith([{ lat: 40.7128, lng: -74.0060 }], 4);
    });

    expect(useStore.getState().setUserLocation).toHaveBeenCalledWith({ lat: 40.7128, lng: -74.0060 });
    expect(useStore.getState().setReports).toHaveBeenCalledWith([]);
  });

  it('shows an error modal when data fetching fails', async () => {
    getDataOfRoadById.mockRejectedValueOnce(new Error('No se encontraron datos'));

    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('No se encontraron datos')).toBeInTheDocument();
    });
  });
});
