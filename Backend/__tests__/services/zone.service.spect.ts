import { Lifetime } from 'awilix';
import container from '../../src/container';
import ZoneService from '../../src/services/zone.service';
import ZoneRepository from '../../src/repository/zone.repository';
import UserRepository from '../../src/repository/user.repository';
import dbConnection from '../../src/config/dbConnection.config';
import { config } from 'dotenv';
import { IZoneDto} from '../../src/models/zone.interface';
import { IReportDto } from 'models/reports.interface';


jest.mock('../../src/repository/zone.repository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            getAllByUserId: jest.fn(),
            getReports: jest.fn(),
        };
    });
});

describe('Zone Service', () => {
    let zoneService: ZoneService;
    let userRepository: UserRepository;
    let zoneRepository: jest.Mocked<ZoneRepository>;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        zoneRepository = container.resolve<ZoneRepository>('zoneRepository') as jest.Mocked<ZoneRepository>;
    });
    
    const zoneData: IZoneDto = {
        name: 'Test Zone',
        location: { lat: "10.0", lon: "20.0" },
        rad: 50,
        userId: 1
    };

    const report1: IReportDto = {
        content: 'Test Report 1',
        image: 'test.jpg',
        category: "1",
        location: { latitude: 10.0, longitude: 20.0 }
    };

    const zoneReport = [{
        zoneName: 'Test Zone',
        reports: [report1]
    }];

    beforeEach(async () => {
        await dbConnection.sync({ force: true });
        zoneService = container.resolve<ZoneService>('zoneService');
        userRepository = container.resolve<UserRepository>('userRepository');
        
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });
    });

    test('should create a zone', async () => {
        zoneRepository.create.mockResolvedValue(zoneData);
        const zone = await zoneService.create(zoneData);
        expect(zone).toBeDefined();
        expect(zone).toBe(zoneData);
    })

    test('should get all zones', async () => {
        zoneRepository.getAll.mockResolvedValue([zoneData]);
        const zones = await zoneService.getAll();
        expect(zones).toBeDefined();
        expect(zones).toContain(zoneData);
    });

    test('should get a zone by id', async () => {
        zoneRepository.getById.mockResolvedValue(zoneData);
        const zone = await zoneService.getById(1);
        expect(zone).toBeDefined();
        expect(zone).toBe(zoneData);
    })

    test('should get all zones by user id', async () => {
        zoneRepository.getAllByUserId.mockResolvedValue([zoneData]);
        const zones = await zoneService.getAllByUserId(1);
        expect(zones).toBeDefined();
        expect(zones).toContain(zoneData);
    });

    test('should get all reports by zone user id', async () => {
        zoneRepository.getReports.mockResolvedValue([report1]);
        const reports = await zoneService.getNotification(1);
        expect(reports).toBeDefined();
        expect(reports).toContainEqual(zoneReport[0]);
    });

    test('should get all reports by zone', async () => {
        zoneRepository.getReports.mockResolvedValue([report1]);
        const reports = await zoneService.getFilteredReports(zoneData);
        expect(reports).toBeDefined();
        expect(reports).toContain(report1);
    });
})
