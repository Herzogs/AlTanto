import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Map from '@components/Map/Map';
import { useStore, userStore } from '@store';
import { getCategoryFromApi } from '@services/getCategory';
import { useMapClickHandler } from '@hook/useMapClickHandler';

// Mock de hooks y componentes utilizados en Map
vi.mock('@store', () => ({
    useStore: vi.fn(),
    userStore: {
        getState: vi.fn(),
    },
}));
vi.mock('@services/getCategory', () => ({
    getCategoryFromApi: vi.fn(),
}));

vi.mock("@hook/useMapClickHandler", async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useMapClickHandler: vi.fn()
    }
})

vi.mock('@components/Map/LocationMarker', () => ({
    default: () => <div>LocationMarker</div>,
}));
vi.mock('@components/Map/RadiusCircle', () => ({
    default: () => <div>RadiusCircle</div>,
}));
vi.mock('@components/road/Routing', () => ({
    default: () => <div>Routing</div>,
}));
vi.mock('@components/Map/PopupAT', () => ({
    default: () => <div>PopupAT</div>,
}));
vi.mock('@components/Map/MenuButton', () => ({
    default: () => <div>MenuButton</div>,
}));
vi.mock('@components/filter/Filters', () => ({
    default: () => <div>Filters</div>,
}));
vi.mock('@changey/react-leaflet-markercluster', () => ({
    default: ({ children }) => <div>{children}</div>,
}));

describe('Map component', () => {
    beforeEach(() => {
        useStore.mockReturnValue({
            reports: [],
        });

        userStore.getState.mockReturnValue({
            user: { id: '123' },
        });

        getCategoryFromApi.mockResolvedValue([
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
        ]);

        useMapClickHandler.mockReturnValue({
            mapClickHandler: () => null, // Mock de MapClickHandler para evitar errores
        });
    });

    it('renders the Map component correctly', async () => {
        render(<Map userLocation={{ lat: 40.7128, lng: -74.006 }} />);

        expect(screen.getByText('LocationMarker')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('RadiusCircle')).toBeInTheDocument());
        expect(screen.getByText('MenuButton')).toBeInTheDocument();
    });

    it('fetches categories and sets selected categories on mount', async () => {
        render(<Map userLocation={{ lat: 40.7128, lng: -74.006 }} />);

        await waitFor(() => {
            expect(getCategoryFromApi).toHaveBeenCalled();
        });
    });

    /* it('renders filtered reports as markers when reports and selectedCategories are set', async () => {
        // Configuración para mockear useStore con reports y selectedCategories específicos
        useStore.mockReturnValueOnce({
            reports: [
                { id: 1, latitude: 40.7128, longitude: -74.006, categoryName: 'Category 1', categoryId: 1, content: 'Report 1' },
                { id: 2, latitude: 40.7138, longitude: -74.007, categoryId: 2, categoryName: 'Category 2', content: 'Report 2' },
            ],
        });

        const filteredReports = reports; // Simular categorías seleccionadas

        render(<Map userLocation={{ lat: 40.7128, lng: -74.006 }} />);

        await waitFor(() => {
            // Verifica que se renderice al menos un marcador asociado a PopupAT
            expect(screen.getByText('PopupAT')).toBeInTheDocument();
        });
    });

    it('renders no markers when reports or selectedCategories are empty', async () => {
        // Configuración para mockear useStore con reports vacíos
        useStore.mockReturnValueOnce({
            reports: [], // Simular ningún reporte
        });

        const selectedCategories = [1, 2]; // Simular categorías seleccionadas

        render(<Map userLocation={{ lat: 40.7128, lng: -74.006 }} />);

        await waitFor(() => {
            // Verifica que no se encuentre ningún marcador asociado a PopupAT
            expect(screen.queryByText('PopupAT')).toBeNull();
        });
    }); */
});
