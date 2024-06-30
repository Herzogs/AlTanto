
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from '@pages/Profile';
import { userStore } from '@store';
import { getUserById, updateUser } from '@services/userService';

vi.mock('@store', () => ({
    useStore: vi.fn(),
    userStore: vi.fn(),
  }));

vi.mock('@services/userService', () => ({
  getUserById: vi.fn(),
  updateUser: vi.fn(),
}));

describe('UserProfile Component', () => {
  beforeEach(() => {
    userStore.mockReturnValue({
      user: { id: 1 },
    });

    getUserById.mockImplementation((id) => {
      if (id === 1) {
        return Promise.resolve({
          username: 'testuser',
          name: 'Test',
          lastName: 'User',
          email: 'testuser@example.com',
        });
      }
      return Promise.reject(new Error('User not found'));
    });

    updateUser.mockImplementation((id, data) => {
      if (id === 1) {
        return Promise.resolve({
          ...data,
          username: 'testuser',
          name: 'Test',
          lastName: 'User',
          email: 'testuser@example.com',
        });
      }
      return Promise.reject(new Error('User update failed'));
    });
  });

  const renderComponent = () => {
    return render(<UserProfile />, { wrapper: MemoryRouter });
  };

  it('should display loading initially', async () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should fetch and display user data', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
      expect(screen.getByText('Nombre de usuario: testuser')).toBeInTheDocument();
      expect(screen.getByText('Nombre: Test')).toBeInTheDocument();
      expect(screen.getByText('Apellido: User')).toBeInTheDocument();
      expect(screen.getByText('Email: testuser@example.com')).toBeInTheDocument();
    });
  });

  it('should handle user update', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Guardar');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(1, {});
     // expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
     // expect(screen.getByText('Perfil actualizado exitosamente')).toBeInTheDocument();
    });
  });

  it('should Loading...  if user fetch fails', async () => {
    getUserById.mockImplementationOnce(() => Promise.reject(new Error('User not found')));

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  }); 

/*   it('should display error if user update fails', async () => {
    updateUser.mockImplementationOnce(() => Promise.reject(new Error('User update failed')));
  
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
    });  
    const saveButton = screen.getByText('Guardar');
    fireEvent.click(saveButton);  
    await waitFor(() => {
      expect(screen.getByText('Error al actualizar Usuario')).toBeInTheDocument();
    });
  }); */
  
});
