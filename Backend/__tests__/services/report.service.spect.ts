import { Lifetime } from 'awilix';
import container from '../../src/container';
import ReportService from '../../src/services/report.service';
import ReportRepository from '../../src/repository/reports.repository';
import UserRepository from '../../src/repository/user.repository';
import { config } from 'dotenv';
import { IReportDto } from '../../src/models/reports.interface';

jest.mock('../../src/repository/reports.repository', () => {
    return jest.fn().mockImplementation(() => {
        return {
            create: jest.fn(),
            getById: jest.fn(),
            getAll: jest.fn(),
            getByUser: jest.fn(),
            getByGroup: jest.fn(),
            disableOldReports: jest.fn(),
        };
    });
});

describe('Report Service', () => {
    let reportService: ReportService;
    let reportRepository: jest.Mocked<ReportRepository>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        reportRepository = container.resolve<ReportRepository>('reportRepository') as jest.Mocked<ReportRepository>;
        userRepository = container.resolve<UserRepository>('userRepository') as jest.Mocked<UserRepository>;
    });

    beforeEach(async () => {
        reportService = container.resolve<ReportService>('reportService');
    });

    test('should create a report', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });
        const reportData: IReportDto = {
            id: 1,
            content: 'Test Report',
            createAt: new Date(),
            image: 'test-image.png',
            positiveScore: 5,
            negativeScore: 1,
            category: 'Test Category',
            location: {
                latitude: 10.0,
                longitude: 20.0,
            },
            groupId: 1,
            userId: 1,
        };

        reportRepository.create.mockResolvedValue(reportData);

        const createdReport = await reportService.createReport(reportData);

        expect(createdReport).toBeDefined();
        expect(createdReport!.content).toBe(reportData.content);
    });

    test('should get report by id', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });
        const reportData: IReportDto = {
            id: 1,
            content: 'Test Report',
            createAt: new Date(),
            image: 'test-image.png',
            positiveScore: 5,
            negativeScore: 1,
            category: 'Test Category',
            location: {
                latitude: 10.0,
                longitude: 20.0,
            },
            groupId: 1,
            userId: 1,
        };

        reportRepository.getById.mockResolvedValue(reportData);

        const report = await reportService.getById(1);

        expect(report).toBeDefined();
        expect(report!.content).toBe(reportData.content);
    });

    test('should return null when report not found', async () => {
        reportRepository.getById.mockResolvedValue(null);
        await expect(reportService.getById(1)).rejects.toThrow('Report not found.');
    });

    test('should get all reports by user', async () => {

        const reportData: IReportDto = {
            id: 1,
            content: 'Test Report',
            createAt: new Date(),
            image: 'test-image.png',
            positiveScore: 5,
            negativeScore: 1,
            category: 'Test Category',
            location: {
                latitude: 10.0,
                longitude: 20.0,
            },
            groupId: 1,
            userId: 1,
        };

        reportRepository.getByUser.mockResolvedValue([reportData]);

        const reports = await reportService.getByUser(1);

        expect(reports).toBeDefined();
        expect(reports).toHaveLength(1);
        expect(reports[0].content).toBe(reportData.content);
    });

    test('should get all reports by group', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });
        const reportData: IReportDto = {
            id: 1,
            content: 'Test Report',
            createAt: new Date(),
            image: 'test-image.png',
            positiveScore: 5,
            negativeScore: 1,
            category: 'Test Category',
            location: {
                latitude: 10.0,
                longitude: 20.0,
            },
            groupId: 1,
            userId: 1
        };

        reportRepository.getByGroup.mockResolvedValue([reportData]);

        const reports = await reportService.getReportsByGroup(1);

        expect(reports).toBeDefined();
        expect(reports).toHaveLength(1);
        expect(reports[0].content).toBe(reportData.content);
    });

    test('should get all reports', async () => {
        await userRepository.create({
            email: 'crisefeld@gmail.com',
            password: '123456',
            name: 'Cristian',
            lastName: 'Esfeld',
            phoneNumber: '123456',
            username: 'crisefeld',
            id: 1,
        });
        const reportData: IReportDto = {
            id: 1,
            content: 'Test Report',
            createAt: new Date(),
            image: 'test-image.png',
            positiveScore: 5,
            negativeScore: 1,
            category: 'Test Category',
            location: {
                latitude: 10.0,
                longitude: 20.0,
            },
            groupId: 1,
            userId: 1,
        };

        reportRepository.getAll.mockResolvedValue([reportData]);

        const reports = await reportService.getAll();

        expect(reports).toBeDefined();
        expect(reports).toHaveLength(1);
        expect(reports[0].content).toBe(reportData.content);
    });
});
