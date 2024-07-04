// __test__/services/geocode.spec.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { geocodeAddress, reverseGeocode } from '@services/getGeoAdress';

vi.mock('axios');

describe('Geocoding Services', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('geocodeAddress', () => {
    it('should return coordinates for a valid address', async () => {
      const mockResponse = {
        data: [
          {
            lat: '40.712776',
            lon: '-74.005974'
          }
        ]
      };

      axios.get.mockResolvedValue(mockResponse);

      const coordinates = await geocodeAddress('New York');
      expect(coordinates).toEqual({
        lat: 40.712776,
        lon: -74.005974
      });

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://nominatim.openstreetmap.org/search?format=json&q=New%20York'));
    });

    it('should throw an error if no coordinates are found', async () => {
      const mockResponse = {
        data: []
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(geocodeAddress('Unknown Place')).rejects.toThrow('No se encontraron coordenadas para la dirección proporcionada.');

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://nominatim.openstreetmap.org/search?format=json&q=Unknown%20Place'));
    });

    it('should handle network errors correctly', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(geocodeAddress('New York')).rejects.toThrow('Error al obtener la dirección: Network Error');

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://nominatim.openstreetmap.org/search?format=json&q=New%20York'));
    });
  });

  describe('reverseGeocode', () => {
    it('should return address for valid coordinates', async () => {
      const mockResponse = {
        data: {
          display_name: 'New York, NY, USA'
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      const address = await reverseGeocode({ lat: 40.712776, lng: -74.005974 });
      expect(address).toBe('New York, NY, USA');

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://nominatim.openstreetmap.org/reverse?format=json&lat=40.712776&lon=-74.005974'));
    });
    it('should handle errors correctly when no address is found', async () => {
        const mockResponse = {
          data: {}
        };
  
        axios.get.mockResolvedValue(mockResponse);
  
        await expect(reverseGeocode({ lat: 0, lng: 0 })).resolves.toBeUndefined();
  
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://nominatim.openstreetmap.org/reverse?format=json&lat=0&lon=0'));
      });

    it('should handle network errors correctly', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(reverseGeocode({ lat: 40.712776, lng: -74.005974 })).rejects.toThrow('Error al obtener la dirección: Network Error');

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://nominatim.openstreetmap.org/reverse?format=json&lat=40.712776&lon=-74.005974'));
    });
  });
});
