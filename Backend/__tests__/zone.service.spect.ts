import {createZone} from '../src/services/zone.service'; // Ajusta la ruta según la ubicación de tu archivo
import Zone from '../src/models/Zone'; // Ajusta la ruta según la ubicación de tu archivo
import Location from '../src/models/Location';
import {IZoneRequest} from "../src/interfaces/zone.interface"; // Ajusta la ruta según la ubicación de tu archivo

// Mock para Location.create
jest.mock('../src/models/Location', () => ({
    create: jest.fn(),
}));

describe('createZone', () => {
    it('should create a new zone', async () => {
        // Datos de ejemplo para la nueva zona
        const newZoneRequest: IZoneRequest = {
            name: 'Example Zone',
            longitude: '1.2345',
            latitude: '1.2345',
        };

        // Mock de la ubicación creada
        const location = { get: jest.fn(() => ({ id: 1 })) };
        (Location.create as jest.Mock).mockResolvedValue(location);

        // Ejecución de la función createZone
        await createZone(newZoneRequest);

        // Verificación de que Zone.create fue llamado con los datos correctos
        expect(Zone.create).toHaveBeenCalledWith({
            name: newZoneRequest.name,
            locationId: 1, // Suponiendo que el ID de la ubicación creada es 1
        });
    });

    it('should throw an error if zone creation fails', async () => {
        // Mock de Location.create que falla
        (Location.create as jest.Mock).mockRejectedValue(new Error('Location creation failed'));

        // Datos de ejemplo para la nueva zona
        const newZoneRequest: IZoneRequest = {
            name: 'Example Zone',
            longitude: '1.2345',
            latitude: '1.2345',
        };

        // Verificación de que createZone lance un error si la creación de la zona falla
        await expect(createZone(newZoneRequest)).rejects.toThrow('No se pudo crear la zona');
    });
});