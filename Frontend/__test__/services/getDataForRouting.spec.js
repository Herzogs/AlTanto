// __test__/services/getDataForRoute.spec.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { getDataForRoute } from '@services/getDataForRouting';

vi.mock('axios');

describe('getDataForRoute', () => {
  const mockOrigin = { latitude: 40.712776, longitude: -74.005974 };
  const mockDestiny = { latitude: 34.052235, longitude: -118.243683 };
  const mockProfile = 'driving-car';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return route data on success', async () => {
    const mockResponse = {
      status: 200,
      data: {
        features: [
          {
            properties: {
              summary: {
                distance: 4500,
                duration: 3600
              }
            },
            geometry: {
              coordinates: [[-74.005974, 40.712776], [-118.243683, 34.052235]]
            }
          }
        ]
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    const routeData = await getDataForRoute(mockOrigin, mockDestiny, mockProfile);
    expect(routeData).toEqual({
      distance: 4500,
      duration: 3600,
      coordinates: [[-74.005974, 40.712776], [-118.243683, 34.052235]]
    });

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://api.openrouteservice.org/v2/directions/driving-car'));
  });

  it('should handle errors correctly when API response is not 200', async () => {
    const mockResponse = {
      status: 500,
      data: {
        error: 'Internal Server Error'
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    await expect(getDataForRoute(mockOrigin, mockDestiny, mockProfile)).rejects.toThrow('Error al obtener la ruta: Internal Server Error');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://api.openrouteservice.org/v2/directions/driving-car'));
  });

  it('should handle errors correctly when no routes are found', async () => {
    const mockResponse = {
      status: 200,
      data: {
        features: []
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    await expect(getDataForRoute(mockOrigin, mockDestiny, mockProfile)).rejects.toThrow('No se encontraron rutas');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://api.openrouteservice.org/v2/directions/driving-car'));
  });

  it('should handle network errors correctly', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(getDataForRoute(mockOrigin, mockDestiny, mockProfile)).rejects.toThrow('Error al obtener la ruta: Network Error');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://api.openrouteservice.org/v2/directions/driving-car'));
  });
});
