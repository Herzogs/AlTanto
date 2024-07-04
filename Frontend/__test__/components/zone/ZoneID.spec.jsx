import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ZoneHome from '@components/Zone/ZoneID'; // componente a testear
import { useStore } from '@store';
import useReports from '@hook/useReports';
import { getZone } from '@services/getZone';
import { useParams, useNavigate } from 'react-router-dom';



vi.mock('@components/header/HeaderHome', () => ({
  default: () => <div>HeaderHome</div>,
}));
vi.mock('@components/Map/Map', () => ({
  default: () => <div>Map Component</div>,
}));
vi.mock('@components/aside/Aside', () => ({
  default: () => <div>Aside</div>,
}));
vi.mock('@components/slider/SliderButton', () => ({
  default: () => <div>SliderButton</div>,
}));

vi.mock('@components/modal/ModalAT', () => ({
    default: () => <div>ModalAT</div>,
  }));

vi.mock('@store');
vi.mock('@hook/useReports');
vi.mock('@services/getZone');

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

describe('ZoneHome component', () => {
  beforeEach(() => {
    useStore.mockReturnValue({
      userLocation: { lat: 40.7128, lng: -74.0060 },
      radiusZone: 500,
      setUserLocation: vi.fn(),
      setRadiusZone: vi.fn(),
      setMarkerPosition: vi.fn(),
      reports: [{ id: 1, title: 'Report 1' }],
    });

    useReports.mockReturnValue({
      fetchReports: vi.fn(),
    });

    getZone.mockResolvedValue({
      rad: '500',
      location: { lat: 40.7128, lon: -74.0060 },
      name: 'Test Zone',
    });
    useParams.mockReturnValue({ id: '1' });
    useNavigate.mockReturnValue(vi.fn());
  });

  it('renders ZoneHome component correctly', async () => {
    render(<ZoneHome />);
    await waitFor(() => {
      expect(screen.getByText('HeaderHome')).toBeInTheDocument();
      expect(screen.getByText('Test Zone')).toBeInTheDocument();
      expect(screen.getByText('Aside')).toBeInTheDocument();
      expect(screen.getByText('Map Component')).toBeInTheDocument();
      expect(screen.getByText('SliderButton')).toBeInTheDocument();
    });
  });


it('shows error modal when there is an error fetching zone data', async () => {   
   
    useParams.mockReturnValue({ id: '' });   
    await act(async() => render(<ZoneHome />));  
    await waitFor(() => {
        expect(screen.getByText('ModalAT')).toBeInTheDocument();      
    });     
  });   


});

