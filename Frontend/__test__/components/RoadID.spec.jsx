import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import RoadID from '@components/road/RoadID';
import axiosInstance from '@interceptors/axiosConfig';
import { fetchReports } from '@services/getReportsInRoutings';
import { getDataOfRoadById } from '@services/getRoutesByUser';

// Mock de servicios y stores utilizados en RoadID
vi.mock('@services/getReportsInRoutings', () => ({
    fetchReports: vi.fn(),
  }));
  vi.mock('@services/getRoutesByUser', () => ({
    getDataOfRoadById: vi.fn(),
  }));
  
  // Mock de useStore
  const mockUseStore = {
    getState: vi.fn().mockReturnValue({
      routeCoordinates: [{ lat: 40.7128, lng: -74.0060 }],
      userLocation: { lat: 40.7128, lng: -74.0060 },
      setUserLocation: vi.fn(),
      reports: [],
      setReports: vi.fn(),
    }),
  };
  
  vi.mock('@store', () => ({
    useStore: mockUseStore,
  }));
  
  vi.mock('@changey/react-leaflet-markercluster', () => ({
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
  }));

describe('RoadID component', () => {

    beforeEach(() => {
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
  

  it('renders loading state initially', async () => {
    render(<RoadID />);
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('renders road details after data is loaded', async () => {
    render(<RoadID />);
    await waitFor(() => {
      expect(screen.getByText('Road Name')).toBeInTheDocument();
      expect(screen.getByText('Origen: Address Origin')).toBeInTheDocument();
      expect(screen.getByText('Destino: Address Destination')).toBeInTheDocument();
      expect(screen.getByText('Distancia: 10 km')).toBeInTheDocument();
    });
  });

  it('renders error modal when data fetching fails', async () => {
    // Mock a scenario where data fetching fails
    vi.spyOn(axiosInstance, 'get').mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<RoadID />);
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
