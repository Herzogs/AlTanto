import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Zones from '@components/Zone/Zones';
import { getZoneByUserId } from '@services/getZone';
import { userStore } from '@store';

// Mockear el módulo de servicios
vi.mock('@services/getZone', () => ({
  getZoneByUserId: vi.fn(),
}));

describe('Zones component', () => {
  beforeEach(() => {
    // Mockear el estado del usuario
    userStore.getState = vi.fn().mockReturnValue({
      user: { id: '123' },
    });
    
    // Mockear la respuesta de getZoneByUserId
    getZoneByUserId.mockResolvedValue([
      { id: 1, name: 'Zona 1' },
      { id: 2, name: 'Zona 2' },
    ]);
  });

  it('renders zones when zones exist', async () => {
    const handleClose = vi.fn();
    render(
      <Router>
        <Zones handleClose={handleClose} />
      </Router>
    );

    expect(screen.getByText('Zonas')).toBeInTheDocument();
    expect(screen.getByText('Crear')).toBeInTheDocument();
    // Esperar a que las zonas se rendericen
    await vi.waitFor(() => {
      expect(screen.getByText('Zona 1')).toBeInTheDocument();
      expect(screen.getByText('Zona 2')).toBeInTheDocument();
    });
  });

  it('renders no zones when none exist', async () => {
    getZoneByUserId.mockResolvedValueOnce([]);
    const handleClose = vi.fn();
    render(
      <Router>
        <Zones handleClose={handleClose} />
      </Router>
    );

    expect(screen.getByText('Zonas')).toBeInTheDocument();
    expect(screen.getByText('Crear')).toBeInTheDocument();
    await vi.waitFor(() => {
      expect(screen.queryByText('Zona 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Zona 2')).not.toBeInTheDocument();
    });
  });

  it('navigates to create zone page on link click', async () => {
    const handleClose = vi.fn();
    render(
      <Router>
        <Zones handleClose={handleClose} />
      </Router>
    );
    userEvent.click(screen.getByText('Crear'));
    await vi.waitFor(() => {
      expect(window.location.pathname).toBe('/form/zona');
    });
  });


  
});
