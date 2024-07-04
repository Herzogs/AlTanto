// __test__/services/getCategoryFromApi.spec.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import { getCategoryFromApi } from '@services/getCategory';

vi.mock('@interceptors/axiosConfig');

describe('getCategoryFromApi', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return categories on success', async () => {
    const mockResponse = {
      status: 200,
      data: [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
        { id: 3, name: "Category 3" }
      ]
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const categories = await getCategoryFromApi();
    expect(categories).toEqual(mockResponse.data);
    expect(axiosInstance.get).toHaveBeenCalledWith('/categories');
  });

  it('should handle errors correctly', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Network Error'));

    const categories = await getCategoryFromApi();
    expect(categories).toEqual([]);
    expect(axiosInstance.get).toHaveBeenCalledWith('/categories');
  });

  it('should handle non-200 responses correctly', async () => {
    const mockResponse = {
      status: 500,
      data: []
    };

    axiosInstance.get.mockResolvedValue(mockResponse);

    const categories = await getCategoryFromApi();
    expect(categories).toEqual([]);
    expect(axiosInstance.get).toHaveBeenCalledWith('/categories');
  });
});
