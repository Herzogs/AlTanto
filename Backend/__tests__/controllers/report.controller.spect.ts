import ReportRepository from "../../src/repository/reports.repository";
import { IReportDto } from "../../src/models/reports.interface";
import container from "../../src/container";
import { config } from "dotenv";
import { Lifetime } from "awilix";
import GroupRepository from "../../src/repository/group.repository";
import dbConnection from "../../src/config/dbConnection.config";
import UserRepository from "../../src/repository/user.repository";
import { IGroup } from "../../src/models/group.interface";

describe('Report Repository', () => {
    let reportRepository: ReportRepository;
    let userRepository: UserRepository;
    let groupRepository: GroupRepository;

    beforeAll(async () => {
        config();
        container.loadModules([
            ['../../src/models/*.model.ts', Lifetime.SCOPED]
        ]);
        reportRepository = container.resolve<ReportRepository>('reportRepository');
        userRepository = container.resolve<UserRepository>('userRepository');
        groupRepository = container.resolve<GroupRepository>('groupRepository');
    });


    beforeEach(async () => {
        await dbConnection.sync({ force: true });
    });

    test('should create a report', async () => {
        const newReport: IReportDto = {
            content: 'Test report content',
            category: '1',
            location: { latitude: 10.0, longitude: 20.0 },
            image: 'test.jpg'
        };

        const createdReport = await reportRepository.create(newReport);
        expect(createdReport).toBeDefined();
        expect(createdReport!.content).toBe(newReport.content);
    });

    test('should get a report by id', async () => {
        const newReport: IReportDto = {
            content: 'Another test report content',
            category: '2',
            location: { latitude: 11.0, longitude: 21.0 },
            image: 'test2.jpg'
        };

        const createdReport = await reportRepository.create(newReport);

        expect(createdReport).toBeDefined();

        const fetchedReport = await reportRepository.getById(createdReport!.id as number);
        expect(fetchedReport).toBeDefined();
        expect(fetchedReport!.content).toBe(newReport.content);
    });

    test('should get all reports', async () => {


        const newReport1: IReportDto = {
            content: 'Test report 1 content',
            category: '1',
            location: { latitude: 12.0, longitude: 22.0 },
            image: 'test3.jpg'
        };

        const newReport2: IReportDto = {
            content: 'Test report 2 content',
            category: '2',
            location: { latitude: 13.0, longitude: 23.0 },
            image: 'test4.jpg',
        };

        await reportRepository.create(newReport1);
        await reportRepository.create(newReport2);

        const reports = await reportRepository.getAll();

        expect(reports).toBeDefined();
        expect(reports.length).toBeGreaterThanOrEqual(2);
    });

    test('should get reports by group id', async () => {
        await userRepository.create({
            email: 'test@example.com',
            password: 'password',
            name: 'John',
            lastName: 'Doe',
            phoneNumber: '123456789',
            username: 'johndoe',
            id: 1,
        });

        const newGroup: IGroup = {
            name: 'Test Group',
            ownerId: 1,
        };

        await groupRepository.create(newGroup);

        const newReport1: IReportDto = {
            content: 'Group specific report 1',
            category: '1',
            location: { latitude: 15.0, longitude: 25.0 },
            image: 'test6.jpg',
            groupId: 1,

        };

        const newReport2: IReportDto = {
            content: 'Group specific report 2',
            category: '2',
            location: { latitude: 16.0, longitude: 26.0 },
            image: 'test7.jpg',
            groupId: 1
        };

        await reportRepository.create(newReport1);
        await reportRepository.create(newReport2);

        const groupReports = await reportRepository.getByGroup(1);


        expect(groupReports).toBeDefined();
        expect(groupReports.length).toBeGreaterThanOrEqual(1);
        expect(groupReports[0].groupId).toBe(1);
    });
})h