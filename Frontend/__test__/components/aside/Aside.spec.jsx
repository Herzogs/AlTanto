import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Aside from '@components/aside/Aside';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter


// Mock de los componentes internos
vi.mock('@components/Zone/Zones', () => ({
  default: () => <div>ZONES</div>,
}));
vi.mock('@components/road/Roads', () => ({
  default: () => <div>ROADS</div>,
}));
vi.mock('@components/group/Groups', () => ({
  default: () => <div>GROUP</div>,
}));
vi.mock('@components/notification/Notifications', () => ({
  default: () => <div>NOTIFICATIONS</div>,
}));
vi.mock('@mui/icons-material/Apps', () => ({
  default: () => <div>ICONO</div>,
}));

describe('Aside Component', () => {
  let component;

 
  beforeEach(() => {
  });
 
  it('should render AppsIcon', () => {
    component = render(
      <MemoryRouter>
        <Aside />
      </MemoryRouter>
    );
    const iconElement = screen.getByText('ICONO');
    expect(iconElement).toBeInTheDocument();
  });

  it('should open Offcanvas when button Aside is clicked', () => {

    component = render(
      <MemoryRouter>
        <Aside />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("ICONO"));
    expect(screen.getByText("ICONO")).toBeInTheDocument();
    expect(screen.getByText("ZONES")).toBeInTheDocument();
    expect(screen.getByText("ROADS")).toBeInTheDocument();
    expect(screen.getByText("GROUP")).toBeInTheDocument();
    expect(screen.getByText("NOTIFICATIONS")).toBeInTheDocument();
  });

  it('should render Notifications component in Offcanvas', async () => {
    component = render(
      <MemoryRouter>
        <Aside />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("ICONO")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("ICONO"));

    await waitFor(() => {
      expect(screen.getByText("ZONES")).toBeInTheDocument();
      expect(screen.getByText("ROADS")).toBeInTheDocument();
      expect(screen.getByText("GROUP")).toBeInTheDocument();
    });
    const closeButton = screen.getByRole('button', { class: 'btn-close', name: /Close/ });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("ZONES")).not.toBeInTheDocument();
      expect(screen.queryByText("ROADS")).not.toBeInTheDocument();
      expect(screen.queryByText("GROUP")).not.toBeInTheDocument();
      expect(screen.queryByText("NOTIFICATIONS")).not.toBeInTheDocument();
    });
  });
});