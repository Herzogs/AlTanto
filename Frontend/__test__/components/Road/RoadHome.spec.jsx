import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Roads from '@pages/Roads';
import { getRoutesByUserId } from '@services/getRoutesByUser';
import { useStore, userStore } from '@store';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock de servicios y stores utilizados en Roads
vi.mock('@services/getRoutesByUser', () => ({
  getRoutesByUserId: vi.fn(),
}));

vi.mock('@store', () => ({
  useStore: {
    getState: vi.fn(),
  },
  userStore: {
    getState: vi.fn(),
  },
}));

describe('Roads component', () => {
  beforeEach(() => {
    useStore.getState.mockReturnValue({
      setReports: vi.fn(),
    });

    userStore.getState.mockReturnValue({
      user: { id: '123' },
    });

    getRoutesByUserId.mockResolvedValue([
      { id: 1, name: 'Route 1' },
      { id: 2, name: 'Route 2' },
    ]);
  });

  it('renders the Roads component correctly', () => {
    render(
      <Router>
        <Roads />
      </Router>
    );

    expect(screen.getByText('Gestionar Rutas')).toBeInTheDocument();
    expect(screen.getByText('Crear nueva ruta')).toBeInTheDocument();
  });

  it('fetches routes and sets state on mount', async () => {
    render(
      <Router>
        <Roads />
      </Router>
    );

    await waitFor(() => {
      expect(getRoutesByUserId).toHaveBeenCalledWith('123');
    });

    await waitFor(() => {
      expect(screen.getByText('Route 1')).toBeInTheDocument();
      expect(screen.getByText('Route 2')).toBeInTheDocument();
    });
  });

  it('renders message when no routes are available', async () => {
    getRoutesByUserId.mockResolvedValueOnce([]);

    render(
      <Router>
        <Roads />
      </Router>
    );

    await waitFor(() => {
      expect(getRoutesByUserId).toHaveBeenCalledWith('123');
    });

    await waitFor(() => {
      expect(screen.getByText('Todavia no tienes Rutas guardadas')).toBeInTheDocument();
    });
  });
});
