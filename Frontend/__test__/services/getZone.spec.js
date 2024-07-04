import { describe, it, expect, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import { getZone, getZoneByUserId } from '@services/getZone';

vi.mock('@interceptors/axiosConfig');

describe('getZone', () => {
  it('should fetch zone by ID with status 200', async () => {
    const zoneId = 1;
    const mockResponse = {
      status: 200,
      data: { id: zoneId, name: 'Test Zone' }
    };

    axiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await getZone(zoneId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/zones/${zoneId}`);

    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error on unsuccessful fetch', async () => {
    const zoneId = 1;
  
    const mockErrorResponse = {
      status: 404,
      statusText: 'Not Found'
    };
  
    axiosInstance.get.mockResolvedValueOnce(mockErrorResponse);
  
    try {
      await getZone(zoneId);
    } catch (error) {
      expect(error.message).toBe('Error al obtener la zona');
    }
  
    expect(axiosInstance.get).toHaveBeenCalledWith(`/zones/${zoneId}`);
  });
  
});

describe('getZoneByUserId', () => {
  it('should fetch zone by user ID with status 200', async () => {
    const userId = 1;
    const mockResponse = {
      status: 200,
      data: { id: 1, userId: userId, name: 'User Zone' }
    };

    axiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await getZoneByUserId(userId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/zones/user/${userId}`);

    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error on unsuccessful fetch', async () => {
    const userId = 1;
  
    const mockErrorResponse = {
      status: 404,
      statusText: 'Not Found'
    };
  
    axiosInstance.get.mockResolvedValueOnce(mockErrorResponse);
  
    try {
      await getZoneByUserId(userId);
    } catch (error) {
      expect(error.message).toBe('Error al obtener la zona');
    }  
    expect(axiosInstance.get).toHaveBeenCalledWith(`/zones/user/${userId}`);
  });
  
});
