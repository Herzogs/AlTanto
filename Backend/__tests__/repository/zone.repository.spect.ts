import ZoneRepository from "../../src/repository/zone.repository";
import { IZoneDto } from "../../src/models/zone.interface";
import { IReportDto } from "../../src/models/reports.interface";
import container from "../../src/container";
import dbConnection from "../../src/config/dbConnection.config";
import ReportRepository from "../../src/repository/reports.repository";
import UserRepository from "../../src/repository/user.repository";

describe("Zone Repository", () => {
    let zoneRepository: ZoneRepository;
    let reportRepository: ReportRepository;
    let userRepository: UserRepository;

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
        location: { latitude: 10.0, longitude: 20.0 },
        userId: 1,
    };

    beforeAll(async () => {
        await dbConnection.sync({ force: true });
        zoneRepository = container.resolve<ZoneRepository>('zoneRepository');
        reportRepository = container.resolve<ReportRepository>('reportRepository');
        userRepository = container.resolve<UserRepository>('userRepository');
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true });
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

        const createdZone = await zoneRepository.create(zoneData);
        expect(createdZone).toBeDefined();
        expect(createdZone!.name).toBe(zoneData.name);
        expect(createdZone!.location.lat.toString()).toBe(zoneData.location.lat);
        expect(createdZone!.location.lon.toString()).toBe(zoneData.location.lon);
        expect(createdZone!.rad).toBe(zoneData.rad);
        expect(createdZone!.userId).toBe(zoneData.userId);
    });

    test('should get all zones', async () => {

        const createdZone = await zoneRepository.create(zoneData);

        const zones = await zoneRepository.getAll();
        expect(zones).toBeDefined();
        expect(zones.length).toBe(1);
        expect(zones[0].name).toBe(createdZone?.name);
        expect(zones[0].location.lat).toBe(createdZone?.location.lat);
        expect(zones[0].location.lon).toBe(createdZone?.location.lon);

    });

    test('should get all zones by userId', async () => {
        const createdZone = await zoneRepository.create(zoneData);
        const zones = await zoneRepository.getAllByUserId(1);
        expect(zones).toBeDefined();
        expect(zones.length).toBe(1);
        expect(zones[0].name).toBe(createdZone?.name);
        expect(zones[0].location.lat).toBe(createdZone?.location.lat);
        expect(zones[0].location.lon).toBe(createdZone?.location.lon);
    });

    test('should get a zone by id', async () => {
        const createdZone = await zoneRepository.create(zoneData);
        const zone = await zoneRepository.getById(createdZone!.id as number);
        expect(zone).toBeDefined();
        expect(zone!.name).toBe(createdZone?.name);
        expect(zone!.location.lat).toBe(createdZone?.location.lat);
        expect(zone!.location.lon).toBe(createdZone?.location.lon);
    });

    test('should delete a zone by id', async () => {
        const createdZone = await zoneRepository.create(zoneData);
        const result = await zoneRepository.deleteById(createdZone!.id as number);
        expect(result).toBe(true);
        const zone = await zoneRepository.getById(createdZone!.id as number);
        expect(zone).toBeNull();
    });

    test('should return false when deleting a non-existing zone', async () => {
        const result = await zoneRepository.deleteById(999);
        expect(result).toBe(false);
    });

    test('should give report of zones', async () => {
        await zoneRepository.create(zoneData);
        await reportRepository.getAll()
        await reportRepository.create(report1);
        await reportRepository.getAll()
        const reports = await zoneRepository.getReports(zoneData) as IReportDto[];
        expect(reports).toBeDefined();
        expect(reports!.length).toBeGreaterThan(0);
        expect(reports![0].content).toBe(report1.content);
    });

    test('should give null if no report found', async () => {
        const reports = await zoneRepository.getReports(zoneData);
        expect(reports).toHaveLength(0);
    });
});
