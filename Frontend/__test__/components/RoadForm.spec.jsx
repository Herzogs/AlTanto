import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoutForm from '@components/road/RoutForm';
import { geocodeAddress } from '@services/getGeoAdress';
import { sendRoute } from '@services/sendData';
import { fetchReports } from '@services/getReportsInRoutings';
import { useStore, userStore } from '@store';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock de servicios y stores utilizados en RoutForm
vi.mock('@services/getGeoAdress', () => ({
  geocodeAddress: vi.fn(),
}));
vi.mock('@services/sendData', () => ({
  sendRoute: vi.fn(),
}));
vi.mock('@services/getReportsInRoutings', () => ({
  fetchReports: vi.fn(),
}));
vi.mock('@store', () => ({
  useStore: vi.fn(),
  userStore: vi.fn(),
}));

vi.mock('@components/Map/Map', () => ({
  default: () => <div>Map</div>,
}));

vi.mock('@components/modal/ModalAT', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@changey/react-leaflet-markercluster', () => ({
    default: ({ children }) => <div>{children}</div>,
}));


describe('RoutForm component', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      setUserLocation: vi.fn(),
      setReports: vi.fn(),
      setRouteCoordinates: vi.fn(),
      distance: 10,
      time: 20,
    });

    userStore.mockReturnValue({
      user: { id: '123' },
    });

    geocodeAddress.mockResolvedValue({
      lat: 40.7128,
      lon: -74.0060,
    });

    sendRoute.mockResolvedValue({
      title: 'Ruta guardada',
      message: 'La ruta se ha guardado exitosamente.',
    });

    fetchReports.mockResolvedValue([]);
  });


  it('renders the RoutForm component correctly', () => {
    render(
      <Router>
        <RoutForm />
      </Router>
    );

    expect(screen.getByText('Crear Ruta')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección origen:')).toBeInTheDocument();
    expect(screen.getByLabelText('Dirección destino:')).toBeInTheDocument();
    expect(screen.getByText('Ver Ruta')).toBeInTheDocument();
  });
/*
  it('handles form submission and shows modal on success', async () => {

    geocodeAddress.mockResolvedValue({ lat: 40.7128, lon: -74.0060 });
    sendRoute.mockResolvedValue({ title: 'Ruta guardada', message: 'La ruta se ha guardado exitosamente.' });
    useStore.mockReturnValue({
      userLocation: { lat: 40.7128, lon: -74.0060 },
      setReports: vi.fn(),
      setUserLocation: vi.fn(),
      setRouteCoordinates: vi.fn(),
      distance: 10,
      time: 20,
    })

    const { container } = render(
      <Router>
        <RoutForm />
      </Router>
    );

    
    // Cambiar los campos del formulario
    fireEvent.change(screen.getByLabelText('Dirección origen:'), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText('Dirección destino:'), {
      target: { value: '456 Elm St' },
    });
  
    // Hacer clic en "Ver Ruta"
    fireEvent.click(screen.getByText('Ver Ruta'),{
      target: { value: true}
    });
  
    // Esperar a que las coordenadas se obtengan y se llamen las funciones correspondientes
    await waitFor(() => {
      expect(geocodeAddress).toHaveBeenCalledWith('123 Main St');
      expect(geocodeAddress).toHaveBeenCalledWith('456 Elm St');
    });
  
    // Asegurarse de que el estado visible se haya cambiado
    await waitFor(() => {
      expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
    });
  
    // Cambiar el campo de nombre
    fireEvent.change(screen.getByLabelText('Nombre:'), {
      target: { value: 'Ruta 1' },
    });

     // Hacer clic en "Guardar Ruta"
    fireEvent.click(screen.getByText('Guardar'));
    
    await waitFor(() => {
      vi.spyOn(sendRoute).mock({
        data: {
          name: 'Ruta 1',
          origin: '123 Main St',
          destination: '456 Elm St',
        },
        startAddress: '123 Main St',
        endAddress: '456 Elm St',
        startPoint: { lat: 40.7128, lon: -74.0060 },
        endPoint: { lat: 40.7128, lon: -74.0060 },
        distance: 10,
        time: 20,
        id: '123',
      })


      expect(sendRoute).toHaveBeenCalledWith({
        data: {
          name: 'Ruta 1',
          origin: '123 Main St',
          destination: '456 Elm St',
        },
        startAddress: '123 Main St',
        endAddress: '456 Elm St',
        startPoint: { lat: 40.7128, lon: -74.0060 },
        endPoint: { lat: 40.7128, lon: -74.0060 },
        distance: 10,
        time: 20,
        id: '123',
      });

      
    });
    vi.spyOn(sendRoute).mockResolvedValueOnce({
      title: 'Ruta guardada',
      message: 'La ruta se ha guardado exitosamente.',
    });
    console.log(container);
    // Verificar que el modal de éxito se muestre
    expect(screen.getByText('Ruta guardada')).toBeInTheDocument();
    expect(screen.getByText('La ruta se ha guardado exitosamente.')).toBeInTheDocument();
  });
*/
  it('shows error message when coordinates cannot be fetched', async () => {
    geocodeAddress.mockRejectedValueOnce(new Error('Error al obtener coordenadas'));

    render(
      <Router>
        <RoutForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Dirección origen:'), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText('Dirección destino:'), {
      target: { value: '456 Elm St' },
    });

    fireEvent.click(screen.getByText('Ver Ruta'));

    await waitFor(() => {
      expect(screen.getByText('* Error al obtener coordenadas')).toBeInTheDocument();
    });
  });
});
