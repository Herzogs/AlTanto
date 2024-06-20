import { Lifetime } from 'awilix';
import container from '../../src/container';
import ReportService from '../../src/services/report.service';
import ReportRepository from '../../src/repository/reports.repository';
import dbConnection from '../../src/config/dbConnection.config';
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

    beforeAll(() => {
        config();
        container.loadModules([
            ['../../src/repository/*.repository.ts', Lifetime.SCOPED],
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        reportRepository = container.resolve<ReportRepository>('reportRepository') as jest.Mocked<ReportRepository>;
    });

    beforeEach(async () => {
        await dbConnection.sync({ force: true });
        reportService = container.resolve<ReportService>('reportService');
    });

    afterAll(async () => {
        await dbConnection.close(); 
    });

    test('should create a report', async () => {
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
        };

        reportRepository.create.mockResolvedValue(reportData);

        const createdReport = await reportService.createReport(reportData);

        expect(createdReport).toBeDefined();
        expect(createdReport!.content).toBe(reportData.content);
    });

    test('should get report by id', async () => {
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
        };

        reportRepository.getByUser.mockResolvedValue([reportData]);

        const reports = await reportService.getByUser(1);

        expect(reports).toBeDefined();
        expect(reports).toHaveLength(1);
        expect(reports[0].content).toBe(reportData.content);
    });

    test('should get all reports by group', async () => {
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
        };

        reportRepository.getByGroup.mockResolvedValue([reportData]);

        const reports = await reportService.getReportsByGroup(1);

        expect(reports).toBeDefined();
        expect(reports).toHaveLength(1);
        expect(reports[0].content).toBe(reportData.content);
    });

    test('should get all reports', async () => {
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
        };

        reportRepository.getAll.mockResolvedValue([reportData]);

        const reports = await reportService.getAll();

        expect(reports).toBeDefined();
        expect(reports).toHaveLength(1);
        expect(reports[0].content).toBe(reportData.content);
    });

    test('should disable old reports', async () => {
        await reportService.disableOldReports();
        expect(reportRepository.disableOldReports).toHaveBeenCalledTimes(1);
    });
});
