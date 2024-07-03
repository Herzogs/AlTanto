import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Logout from '@components/auth/Logout';

const mockSetToken = vi.fn();
const mockSetUser = vi.fn();
const mockSetReports = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@store', () => ({
  userStore: () => ({
    setToken: mockSetToken,
    setUser: mockSetUser,
  }),
  useStore: () => ({
    setReports: mockSetReports,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Logout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call setToken, setUser, setReports, and navigate on component mount', () => {
    render(<Logout />);
    expect(mockSetToken).toHaveBeenCalledWith(null);
    expect(mockSetUser).toHaveBeenCalledWith({
      name: null,
      lastName: null,
      email: null,
    });
    expect(mockSetReports).toHaveBeenCalledWith([]);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
