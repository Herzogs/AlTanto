import { describe, it, expect, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import { sendReport, sendRoute, saveZone, registerUser, validateCode, updateScoring } from '@services/sendData';

// Mockear axiosInstance para todas las pruebas
vi.mock('@interceptors/axiosConfig');

describe('API Functions', () => {
  it('sendReport should handle successful report submission', async () => {
    const mockFormData = {
      content: 'Test report content',
      category: '1',
      latitude: 123.456,
      longitude: 456.789,
      userId: 'user123',
      image: null,
      groupId: 'group123',
    };

    axiosInstance.post.mockResolvedValueOnce({ status: 201 });

    await expect(sendReport(mockFormData)).resolves.toBeUndefined();
    expect(axiosInstance.post).toHaveBeenCalledWith('/reports', expect.any(FormData), {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });
  });

  
  it('saveZone should handle successful zone saving', async () => {
    const mockZoneData = { name: 'Zone A', radio: 50 };
    const mockCoordinates = { lat: 123.456, lng: 456.789 };
    const userId = 'user123';

    axiosInstance.post.mockResolvedValueOnce({ status: 201, data: { zoneId: 'zone123' } });

    await expect(saveZone(mockZoneData, mockCoordinates, userId)).resolves.toEqual({ zoneId: 'zone123' });
    expect(axiosInstance.post).toHaveBeenCalledWith('/zones', {
      name: 'Zone A',
      latitude: '123.456',
      longitude: '456.789',
      radio: 50,
      userId: 'user123',
    });
  });

  it('registerUser should handle successful user registration', async () => {
    const mockUserData = { username: 'testuser', password: 'password123' };

    axiosInstance.post.mockResolvedValueOnce({ status: 201, data: { userId: 'user123' } });

    await expect(registerUser(mockUserData)).resolves.toEqual({ userId: 'user123' });
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', mockUserData);
  });

  it('validateCode should handle successful code validation', async () => {
    const mockValidationData = { code: '123456' };

    axiosInstance.post.mockResolvedValueOnce({ status: 200, data: { valid: true } });

    await expect(validateCode(mockValidationData)).resolves.toEqual({ valid: true });
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/validate-code', mockValidationData);
  });

  it('updateScoring should handle successful scoring update', async () => {
    const mockScoringData = { reportId: 'report123', vote: 5, userId: 'user123' };

    axiosInstance.post.mockResolvedValueOnce({ status: 200 });

    await expect(updateScoring(mockScoringData)).resolves.toBeUndefined();
    expect(axiosInstance.post).toHaveBeenCalledWith('/reports/scoring', {
      reportId: 'report123',
      vote: 5,
      userId: 'user123',
    });
  });

});
