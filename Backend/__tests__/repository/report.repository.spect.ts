import ReportRepository from "../../src/repository/reports.repository";
import { IReportDto } from "../../src/models/reports.interface";
import container from "../../src/container";
import { config } from "dotenv";
import { Lifetime } from "awilix";
import UserRepository from "../../src/repository/user.repository";
import dbConnection from "../../src/config/dbConnection.config";

type ReportDtoWithUserId = IReportDto & { userId?: number };

describe('Report Repository', () => {
    let reportRepository: ReportRepository;
    let userRepository: UserRepository;

    beforeAll(async () => {
        config();
        await dbConnection.sync({ force: true }); 
        container.loadModules([
            ['../../src/models/*.model.ts', Lifetime.SCOPED],
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
        ]);
        reportRepository = container.resolve<ReportRepository>('reportRepository');
        userRepository = container.resolve<UserRepository>('userRepository');
    });

    afterAll(async () => {
        await dbConnection.close(); 
    });

    beforeEach(async () => {
        await reportRepository.disableOldReports(); 
    });

    test('should create a report', async () => {
        const user = await userRepository.create({
            email: 'test@example.com',
            password: 'password',
            name: 'John',
            lastName: 'Doe',
            phoneNumber: '123456789',
            username: 'johndoe',
            id: 1,
        });

        const newReport: ReportDtoWithUserId = {
            content: 'Test report content',
            category: '1',
            location: { latitude: 10.0, longitude: 20.0 },
            image: 'test.jpg',
            groupId: 1,
            userId: user.id,
        };

        const createdReport = await reportRepository.create(newReport);

        expect(createdReport).toBeDefined();
        expect(createdReport!.content).toBe(newReport.content);
    });
    
    
    test('should get a report by id', async () => {
        const user = await userRepository.create({
            email: 'test@example.com',
            password: 'password',
            name: 'John',
            lastName: 'Doe',
            phoneNumber: '123456789',
            username: 'johndoe',
            id: 1,
        });

        const newReport: ReportDtoWithUserId = {
            content: 'Another test report content',
            category: '2', 
            location: { latitude: 11.0, longitude: 21.0 },
            image: 'test2.jpg',
            groupId: 2,
            userId: user.id,
        };
    
        const createdReport = await reportRepository.create(newReport);
    
        expect(createdReport).toBeDefined();
    
        const fetchedReport = await reportRepository.getById(createdReport!.id as number);
        expect(fetchedReport).toBeDefined();
        expect(fetchedReport!.content).toBe(newReport.content);
    });

    test('should get all reports', async () => {
        const newReport1: ReportDtoWithUserId = {
            content: 'Test report 1 content',
            category: '1', 
            location: { latitude: 12.0, longitude: 22.0 },
            image: 'test3.jpg',
            groupId: 3,
            userId: 1, 
        };
    
        const newReport2: ReportDtoWithUserId = {
            content: 'Test report 2 content',
            category: '2', 
            location: { latitude: 13.0, longitude: 23.0 },
            image: 'test4.jpg',
            groupId: 4,
            userId: 1, 
        };

        await reportRepository.create(newReport1);
        await reportRepository.create(newReport2);
    
        const reports = await reportRepository.getAll();
    
        expect(reports).toBeDefined();
        expect(reports.length).toBe(2);
    });
    
});
