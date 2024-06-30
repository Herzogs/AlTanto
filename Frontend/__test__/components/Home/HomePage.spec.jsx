import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Home from '@pages/Home';
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

  it('does not render SliderButton when reports are null or an empty array', () => {
    useStore.mockReturnValue({
      ...useStore(),
      reports: null,
    });

    const { rerender } = render(<Home />);
    expect(screen.queryByText('SliderButton')).not.toBeInTheDocument();

    useStore.mockReturnValue({
      ...useStore(),
      reports: [],
    });

    rerender(<Home />);
    expect(screen.queryByText('SliderButton')).not.toBeInTheDocument();
  });


  it('should set initial states on mount', () => {
    const {
      setUserLocation,
      setOldUserLocation,
      setDistance,
      setRoutingMode,
      setRouteCoordinates,
      setMarkerPosition
    } = useStore();

    render(<Home />);
    
    expect(setUserLocation).toHaveBeenCalledWith(null);
    expect(setOldUserLocation).toHaveBeenCalledWith(null);
    expect(setDistance).toHaveBeenCalledWith(0);
    expect(setRoutingMode).toHaveBeenCalledWith(false);
    expect(setRouteCoordinates).toHaveBeenCalledWith(null);
    expect(setMarkerPosition).toHaveBeenCalledWith(null);
  });


  it('should hide loading spinner after loading', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('should render Aside component only if user has id', () => {
    useStore.mockReturnValue({
      ...useStore(),
      reports: [],
    });
    userStore.getState = vi.fn().mockReturnValue({
      user: { id: '123' },
    });

    const { rerender } = render(<Home />);
    expect(screen.getByText('Aside')).toBeInTheDocument();
    userStore.getState = vi.fn().mockReturnValue({
      user: { id: null },
    });

    rerender(<Home />);
    expect(screen.queryByText('Aside')).not.toBeInTheDocument();
  });

  it('should set radiusZone to "500" when userLocation changes', () => {
    const setRadiusZone = vi.fn();

    useStore.mockReturnValue({
      ...useStore(),
      userLocation: { lat: 40.7128, lng: -74.0060 },
      setRadiusZone,
    });

    render(<Home />);

    expect(setRadiusZone).toHaveBeenCalledWith("500");
  });

  it('should not call fetchReports if userLocation is null', async () => {
    const fetchReports = vi.fn();

    useStore.mockReturnValue({
      ...useStore(),
      userLocation: null,
    });

    useReports.mockReturnValue({
      fetchReports,
    });

    render(<Home />);

    await waitFor(() => {
      expect(fetchReports).not.toHaveBeenCalled();
    });
  });

  it('should call setMarkerPosition with null on component mount', () => {
    const setMarkerPosition = vi.fn();

    useStore.mockReturnValue({
      ...useStore(),
      setMarkerPosition,
    });

    render(<Home />);

    expect(setMarkerPosition).toHaveBeenCalledWith(null);
  });
});