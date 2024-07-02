import ZoneRepository from "../../src/repository/zone.repository";

import {ZoneMock, LocationMock} from '../mocks/zone.mock';
import {IZoneDto} from '../../src/models/zone.interface';

describe('ZoneRepository', () => {
    let zoneRepository: ZoneRepository;

    beforeAll(() => {
        ZoneMock.sequelize = {
            query: jest.fn()
        };
        zoneRepository = new ZoneRepository({Zone: ZoneMock, Location: LocationMock});
    });

    it('should create a new zone', async () => {
        // Mock data for creating a new zone
        const newZone: IZoneDto = {
            name: 'Test Zone',
            rad: 1000,
            location: {lat: '54', lon: '55'},
            userId: 1
        };

        const createdZone = await zoneRepository.create(newZone);
        expect(createdZone).toBeDefined();
        expect(createdZone!.id).toEqual(1);
        expect(createdZone!.name).toEqual(newZone.name);
        expect(createdZone!.location.lat).toEqual(newZone.location.lat);
        expect(createdZone!.location.lon).toEqual(newZone.location.lon);
        expect(createdZone!.rad).toEqual(newZone.rad);
        expect(createdZone!.userId).toEqual(newZone.userId);
    });
    it('should return all zones with location details', async () => {
        const zones = await zoneRepository.getAll();
        expect(zones).toHaveLength(2);

    })

    it('should get all zones by userId', async () => {
        const userId = 1;

        const zones = await zoneRepository.getAllByUserId(userId);

        expect(zones).toBeDefined();
        expect(zones).toHaveLength(1);

    });
    it('should return a zone by its id with location details', async () => {
        const zoneId = 1;
        const zoneDto = await zoneRepository.getById(zoneId);

        expect(zoneDto).toBeDefined();
        expect(zoneDto!.id).toEqual(zoneId);
        expect(zoneDto!.name).toEqual('Zone 1');
        expect(zoneDto!.location.lat).toEqual(54);
        expect(zoneDto!.location.lon).toEqual(55);
        expect(zoneDto!.rad).toEqual(1000);
        expect(zoneDto!.userId).toEqual(1);
    });

    it('should return null when zone with specified id is not found', async () => {
        const zoneId = 999;

        ZoneMock.findByPk = jest.fn((id: number) => {
            return Promise.resolve(null);
        });

        const zoneDto = await zoneRepository.getById(zoneId);

        expect(zoneDto).toBeNull();
    });

    it('should return null when there are no reports', async () => {
        // Mock data for zone
        const zone: IZoneDto = {
            name: 'Test Zone',
            rad: 1000,
            location: {lat: '54', lon: '55'},
            userId: 1
        };

        (ZoneMock.sequelize as any).query.mockResolvedValue(null);

        const reports = await zoneRepository.getReports(zone);
        expect(reports).toBeNull();
    });


});



