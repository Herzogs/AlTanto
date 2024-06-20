import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Home from '@pages/Home'; // Asegúrate de que la ruta es correcta
import useReports from '@hook/useReports';
import { useStore, userStore } from '@store';

// Mockear los hooks y componentes utilizados en Home
vi.mock('@hook/useReports');
vi.mock('@store');
vi.mock('@components/header/HeaderHome', () => ({
  default: () => <div>HeaderHome</div>,
}));
vi.mock('@components/Map/Map', () => ({
  default: () => <div>Map</div>,
}));
vi.mock('@components/aside/Aside', () => ({
  default: () => <div>Aside</div>,
}));
vi.mock('@components/slider/SliderButton', () => ({
  default: () => <div>SliderButton</div>,
}));

describe('Home component', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      userLocation: null,
      setUserLocation: vi.fn(),
      setRoutingMode: vi.fn(),
      reports: [],
      setRouteCoordinates: vi.fn(),
      setOldUserLocation: vi.fn(),
      setDistance: vi.fn(),
      radiusZone: '500',
      setRadiusZone: vi.fn(),
      setMarkerPosition: vi.fn(),
    });

    userStore.getState = vi.fn().mockReturnValue({
      user: { id: '123' },
    });

    useReports.mockReturnValue({
      fetchReports: vi.fn(),
    });
  });

  it('renders the Home component correctly', () => {
    render(<Home />);

    // Verificar que los componentes secundarios se renderizan
    expect(screen.getByText('HeaderHome')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Aside')).toBeInTheDocument();
  });

  it('should call setMarkerPosition on mount', () => {
    const { setMarkerPosition } = useStore();
    render(<Home />);
    expect(setMarkerPosition).toHaveBeenCalledWith(null);
  });

  it('should call fetchReports and setRadiusZone when userLocation changes', async () => {
    const fetchReports = vi.fn();
    const setRadiusZone = vi.fn();

    useStore.mockReturnValue({
      userLocation: { lat: 40.7128, lng: -74.0060 },
      setUserLocation: vi.fn(),
      setRoutingMode: vi.fn(),
      reports: [],
      setRouteCoordinates: vi.fn(),
      setOldUserLocation: vi.fn(),
      setDistance: vi.fn(),
      radiusZone: '500',
      setRadiusZone,
      setMarkerPosition: vi.fn(),
    });

    useReports.mockReturnValue({
      fetchReports,
    });

    render(<Home />);

    await waitFor(() => {
      expect(fetchReports).toHaveBeenCalled();
      expect(setRadiusZone).toHaveBeenCalledWith('500');
    });
  });

  it('renders SliderButton when reports are available', () => {
    useStore.mockReturnValue({
      ...useStore(),
      reports: [{ id: 1 }, { id: 2 }],
    });

    render(<Home />);
    expect(screen.getByText('SliderButton')).toBeInTheDocument();
  });
});
