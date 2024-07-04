import { describe, it, expect, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import { fetchReportsByGroup } from '@services/getReportByGroup';

vi.mock('@interceptors/axiosConfig');

describe('fetchReportsByGroup', () => {
  it('should fetch reports by group ID with status 200', async () => {
    const groupId = 1;
    const mockResponse = {
      status: 200,
      data: [
        { id: 1, title: 'Report 1' },
        { id: 2, title: 'Report 2' }
      ]
    };

    axiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await fetchReportsByGroup(groupId);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/reports/group/${groupId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error on unsuccessful fetch', async () => {
    const groupId = 1;
    const mockErrorResponse = {
      status: 404,
      statusText: 'Not Found'
    };

    axiosInstance.get.mockResolvedValueOnce(mockErrorResponse);

    await expect(fetchReportsByGroup(groupId)).rejects.toThrowError('Error al obtener los reportes');
    expect(axiosInstance.get).toHaveBeenCalledWith(`/reports/group/${groupId}`);
  });
});
