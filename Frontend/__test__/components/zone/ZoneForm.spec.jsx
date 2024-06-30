import { render, screen, waitFor, fireEvent} from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import ZoneForm from '@components/Zone/ZoneForm';
import { MemoryRouter } from 'react-router-dom';
import { useStore, userStore } from '@store';



vi.mock('@components/header/HeaderHome', () => ({
  default: () => <div>HeaderHome</div>,
}));
vi.mock('@components/Map/Map', () => ({
  default: () => <div>map</div>,
}));
vi.mock('@components/aside/Aside', () => ({
  default: () => <div>Aside</div>,
}));
vi.mock('@components/slider/SliderButton', () => ({
  default: () => <div>SliderButton</div>,
}));
vi.mock('@components/modal/ModalAT', () => ({
  default: () => <div>ModalAT</div>,
}));

vi.mock('@services/sendData', () => ({
  saveZone: vi.fn(),
}));
vi.mock('@store', () => ({
  useStore: vi.fn(),
  userStore: vi.fn(),
}));
vi.mock('@services/getReportsByLocationAndRadius', () => ({
  fetchReports: vi.fn(),
}));

describe('ZoneForm Component', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      userLocation: null,
      setUserLocation: vi.fn(),
      setReports: vi.fn(),
    });

    userStore.mockReturnValue({
      user: { id: 1 },
    });
  });

  it('renders ZoneForm component correctly', () => {
    render(
      <MemoryRouter>
        <ZoneForm />
      </MemoryRouter>
    );

    expect(screen.getByText('Crear zona')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();

    expect(screen.getByText(/Dirección:/i)).toBeInTheDocument();
    expect(screen.getByText(/Calle, Número y Localidad/i)).toBeInTheDocument();

    expect(screen.getByText('Buscar dirección')).toBeInTheDocument();
    const inputName = screen.getByRole('textbox', { name: /nombre/i });
    expect(inputName).toBeInTheDocument();

    const inputAddress = screen.getByRole('textbox', { name: /dirección/i });
    expect(inputAddress).toBeInTheDocument();

    const buttonSearch = screen.getByRole('button', { name: /buscar dirección/i });
    expect(buttonSearch).toBeInTheDocument();
    const headerHomeElement = screen.queryByText('HeaderHome');
  expect(headerHomeElement).not.toBeInTheDocument();
  });


  it('se cargar los nombres en los campos', async () => {
    const nombre ="casa";
    const direccion =" nnewton 946 , el palomar"
    render(
      <MemoryRouter>
        <ZoneForm />
      </MemoryRouter>
    );
   fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: nombre } });
   fireEvent.change(screen.getByLabelText(/Dirección:/i), { target: { value: direccion } });
   fireEvent.click(screen.getByText('Buscar dirección'));
   await waitFor(() => {
    expect(screen.getByLabelText('Nombre:').value).toBe(nombre);
    expect(screen.getByLabelText(/Dirección:/i).value).toBe(direccion);
  });  
  });



});
