
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Notifications from '@pages/Notifications';
import axiosInstance from '@interceptors/axiosConfig';
import { useStore, userStore } from '@store';

// Mockear los módulos
vi.mock('@interceptors/axiosConfig', async () => {
  const original = await vi.importActual('@interceptors/axiosConfig');
  return {
    __esModule: true,
    ...original,
    default: {
      get: vi.fn(),
    },
  };
});

vi.mock('@store', () => ({
  useStore: vi.fn(),
  userStore: vi.fn(),
}));

vi.mock('@components/header/Header', () => ({
  __esModule: true,
  default: () => <div>Header</div>,
}));

vi.mock('@components/report/Report', () => ({
  __esModule: true,
  default: () => <div>Report</div>,
}));

describe('Notifications Component', () => {
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

    axiosInstance.get.mockImplementation((url) => {
      if (url === `/zones/notification/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [
            {
              zoneName: 'Test Zone',
              reports: [],
            },
          ],
        });
      } 
      if (url === `/group/notifications/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [
            {
              groupName: 'Test Group',
              reports: [],
            },
          ],
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  });

  const renderComponent = () => {
    return render(<Notifications />, { wrapper: MemoryRouter });
  };

  it('should render Mis Notificaciones', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Mis notificaciones')).toBeInTheDocument();
    });
  });

  it('should render Header component', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Header')).toBeInTheDocument();
    });
  });

  it('should display loading initially', async () => {
    renderComponent();
    expect(screen.getByText('Regresar')).toBeInTheDocument();
    expect(screen.getByText('Mis notificaciones')).toBeInTheDocument();
  });

  it('should fetch zones and groups notifications on mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/zones/notification/1');
      expect(axiosInstance.get).toHaveBeenCalledWith('/group/notifications/1');
    });
  });

  it('should display zone notifications when available', async () => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === `/zones/notification/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [
            {
              zoneName: 'Test Zone',
              reports: [{ id: 1 }, { id: 2 }, { id: 3 }],
            },
          ],
        });
      } 
      if (url === `/group/notifications/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [],
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Zona: Test Zone')).toBeInTheDocument();
      expect(screen.getAllByText('Report')).toHaveLength(3);
    });
  });

  it('should display group notifications when available', async () => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === `/zones/notification/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [],
        });
      } 
      if (url === `/group/notifications/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [
            {
              groupName: 'Test Group',
              reports: [{ id: 4 }, { id: 5 }, { id: 6 }],
            },
          ],
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Grupo: Test Group')).toBeInTheDocument();
      expect(screen.getAllByText('Report')).toHaveLength(3);
    });
  });

  it('should display "Ver más" accordion when there are more than 3 reports in a zone', async () => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === `/zones/notification/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [
            {
              zoneName: 'Test Zone',
              reports: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            },
          ],
        });
      } 
      if (url === `/group/notifications/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [],
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Zona: Test Zone')).toBeInTheDocument();
      expect(screen.getByText('Ver más')).toBeInTheDocument();
      expect(screen.getAllByText('Report')).toHaveLength(4);
    });
  });

  it('should display "Ver más" accordion when there are more than 3 reports in a group', async () => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === `/zones/notification/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [],
        });
      } 
      if (url === `/group/notifications/${userStore().user.id}`) {
        return Promise.resolve({
          status: 200,
          data: [
            {
              groupName: 'Test Group',
              reports: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
            },
          ],
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Grupo: Test Group')).toBeInTheDocument();
      expect(screen.getByText('Ver más')).toBeInTheDocument();
      expect(screen.getAllByText('Report')).toHaveLength(4);
    });
  });
});
