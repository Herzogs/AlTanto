import { describe, it, expect, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import loginUser from '@services/login';

vi.mock('@interceptors/axiosConfig');

describe('loginUser', () => {
  it('should login successfully with status 200', async () => {
    const mockData = { username: 'testuser', password: 'testpassword' };
    const mockResponse = {
      status: 200,
      data: { token: 'mocktoken' }
    };

    axiosInstance.post.mockResolvedValueOnce(mockResponse);

    const result = await loginUser(mockData);

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', mockData);
    expect(result.token).toBe('mocktoken');
  });

  it('should throw error on unsuccessful login', async () => {
    const mockData = { username: 'testuser', password: 'wrongpassword' };
    const mockErrorResponse = {
      status: 401,
      statusText: 'Unauthorized'
    };

    axiosInstance.post.mockResolvedValueOnce(mockErrorResponse);

    await expect(loginUser(mockData)).rejects.toThrowError('Error al iniciar sesión');
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', mockData);
  });
});
