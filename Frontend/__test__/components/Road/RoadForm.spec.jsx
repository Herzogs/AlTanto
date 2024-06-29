import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RoutForm from '@components/road/RoutForm';
import { useStore, userStore } from '@store';
import { geocodeAddress } from '@services/getGeoAdress';
import { sendRoute } from '@services/sendData';
import { useForm } from 'react-hook-form';

// Mocking the necessary services and hooks
vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

vi.mock('@components/Map/Map', () => ({
  default: () => <div>map</div>,
}));


vi.mock('@store', () => ({
  useStore: vi.fn(),
  userStore: vi.fn(),
}));

vi.mock('@services/getGeoAdress', () => ({
  geocodeAddress: vi.fn(),
}));

vi.mock('@services/sendData', () => ({
  sendRoute: vi.fn(),
}));

vi.mock('@services/getReportsInRoutings', () => ({
  fetchReports: vi.fn(),
}));

vi.mock('@changey/react-leaflet-markercluster', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('RoutForm Component', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      userLocation: null,
      setUserLocation: vi.fn(),
      setReports: vi.fn(),
      routeCoordinates: [],
      setRouteCoordinates: vi.fn(),
      distance: 10,
      time: 15,
    });

    userStore.mockReturnValue({
      user: { id: 1 },
    });

    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: (fn) => (event) => {
        event.preventDefault();
        return fn();
      },
      watch: vi.fn().mockReturnValue({ origin: '', destination: '' }),
      formState: { errors: {} },
    });
  });

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: MemoryRouter });
  };

  it('should render the form with default values', () => {
    renderWithRouter(<RoutForm />);

    expect(screen.getByLabelText("Dirección origen:")).toBeInTheDocument();
    expect(screen.getByLabelText("Dirección destino:")).toBeInTheDocument();
  });

  it('should call setPoints and show route when addresses are provided', async () => {
   

    geocodeAddress.mockResolvedValueOnce({ lat: 10, lon: 20 });
    geocodeAddress.mockResolvedValueOnce({ lat: 30, lon: 40 });
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: (fn) => (event) => {
        event.preventDefault();
        return fn();
      },
      watch: vi.fn().mockReturnValue({ origin: 'Test Origin', destination: 'Test Destination' }),
      formState: { errors: {} },
    });

    renderWithRouter(<RoutForm />);

    fireEvent.input(screen.getByLabelText("Dirección origen:"), {
      target: { value: 'Test Origin' },
    });
    fireEvent.input(screen.getByLabelText("Dirección destino:"), {
      target: { value: 'Test Destination' },
    });

    fireEvent.click(screen.getByText("Ver Ruta"));

    await waitFor(() => {
      expect(geocodeAddress).toHaveBeenCalledTimes(2);
      // el userLocation no se usa. los puntos se guardan en  startPoint y endPoint. 
      //expect(useStore().setUserLocation).toHaveBeenCalledWith({        lat: 10,        lng: 20,      });
     // expect(setStartPoint).toHaveBeenCalledTimes(1);
     // expect(setStartPoint).toHaveBeenCalledWith({ lat: 10, lon: 20 });
     // expect(setEndPoint).toHaveBeenCalledWith({ lat: 30, lon: 40 });     
      const headerHomeElement = screen.queryByText('map');
      expect(headerHomeElement).not.toBeInTheDocument();     
      expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
      expect(screen.getByText("Guardar")).toBeInTheDocument();

    });  
  });

  it('should handle form submission successfully', async () => {
    useForm.mockReturnValue({
      register: vi.fn(),
      handleSubmit: (fn) => (event) => {
        event.preventDefault();
        return fn();
      },
      watch: vi.fn().mockReturnValue({ origin: 'Test Origin', destination: 'Test Destination' }),
      formState: { errors: {} },
    });
    geocodeAddress.mockResolvedValueOnce({ lat: 10, lon: 20 });
    geocodeAddress.mockResolvedValueOnce({ lat: 30, lon: 40 });
    sendRoute.mockResolvedValueOnce({ message: 'Ruta guardada', title: 'Ruta guardada' });

    renderWithRouter(<RoutForm />);

    fireEvent.input(screen.getByLabelText("Dirección origen:"), {
      target: { value: 'Test Origin' },
    });
    fireEvent.input(screen.getByLabelText("Dirección destino:"), {
      target: { value: 'Test Destination' },
    });

    fireEvent.click(screen.getByText("Ver Ruta"));

    await waitFor(() => {
      expect(screen.getByLabelText("Nombre:")).toBeInTheDocument();
    });

    fireEvent.input(screen.getByLabelText("Nombre:"), {
      target: { value: 'Test Route' },
    });

    fireEvent.click(screen.getByText("Guardar"));

    await waitFor(() => {
      expect(sendRoute).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Recorrido guardado")).toBeInTheDocument();
    });
  });
});
