import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import axiosInstance from '@interceptors/axiosConfig';
import { fetchReportById } from '@services/getReport';

vi.mock('@interceptors/axiosConfig');
vi.mock

describe('fetchReportById', () => {
  it('should handle non-200 status when fetching report', async () => {
    axiosInstance.get.mockResolvedValueOnce({ status: 404, data: { error: 'Report not found' } });

    await expect(fetchReportById(1)).rejects.toThrowError('Error al obtener el reporte');

    expect(axiosInstance.get).toHaveBeenCalledWith('/reports/1');
  });
  it('should handle 200 status with valid report data', async () => {
    const mockResponse = {
      status: 200,
      data: {
        id: 1,
        title: 'Test Report',
        images: null

      }
    };

    axiosInstance.get.mockResolvedValueOnce(mockResponse);

    const report = await fetchReportById(1);
    waitFor(()=>{
    expect(axiosInstance.get).toHaveBeenCalledWith('/reports/1');
    
    expect(report.id).toBe(1);
    expect(report.title).toBe('Test Report');
    expect(report.images).not.toBe('image');

  });
  });
});