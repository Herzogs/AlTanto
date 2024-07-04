import { describe, it, expect, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import { getReportsBy } from '@services/getReportsByLocationAndRadius';

vi.mock('@interceptors/axiosConfig');

describe('getReportsBy', () => {
  it('should fetch reports by location and radius with status 200', async () => {
    const location = { lat: 40.7128, lng: -74.006 };
    const radius = 10;
    const mockResponse = {
      status: 200,
      data: [
        { id: 1, title: 'Report 1' },
        { id: 2, title: 'Report 2' }
      ]
    };

    axiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await getReportsBy(location, radius);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/zones/filterBy?lat=${location.lat}&lon=${location.lng}&rad=${radius}`);

    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error on unsuccessful fetch', async () => {
    const location = { lat: 40.7128, lng: -74.006 };
    const radius = 10;
    const mockErrorResponse = {
      status: 404,
      statusText: 'Not Found'
    };

    axiosInstance.get.mockResolvedValueOnce(mockErrorResponse);

    await expect(getReportsBy(location, radius)).rejects.toThrowError('Error al obtener los datos ');

    expect(axiosInstance.get).toHaveBeenCalledWith(`/zones/filterBy?lat=${location.lat}&lon=${location.lng}&rad=${radius}`);
  });
});
