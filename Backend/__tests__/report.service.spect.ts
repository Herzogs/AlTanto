import * as reportFunctions from '../src/services/report.service';
import {getAllReports} from "../src/services/report.service";
import Report from '../src/models/Report';
import Category from '../src/models/Category';
import Location from '../src/models/Location';
import { IReportRequest } from 'interfaces/reports.interface';


jest.mock('../src/models/Report', () => ({
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
}));
jest.mock('../src/models/Category', () => ({
    findByPk: jest.fn(),
}));

jest.mock('../src/models/Location', () => ({
    create: jest.fn(),
    update: jest.fn(),
}));

describe('getAllReports', () => {
    it('should return all reports', async () => {
        const mockReports = [
            {
                id: 1,
                description: 'Report 1',
                Category: {name: 'Category 1'},
                Location: {latitude: 'latitude 1', longitude: 'longitude 1'}
            },
            {
                id: 2,
                description: 'Report 2',
                Category: {name: 'Category 2'},
                Location: {latitude: 'latitude 2', longitude: 'longitude 2'}
            }
        ];
        (Report.findAll as jest.Mock).mockResolvedValue(mockReports);
        const reports = await getAllReports();
        expect(reports).toEqual(mockReports);
    });
});


describe('getReportById', () => {
    it('should return a specific report by ID', async () => {
        const reportId = 1;
        const mockReport = {
            id: reportId,
            description: 'Test report',
            Category: {name: 'Category 1'},
            Location: {latitude: 'latitude 1', longitude: 'longitude 1'}
        };
        (Report.findByPk as jest.Mock).mockResolvedValue(mockReport);
        const report = await reportFunctions.getReportById(reportId);
        expect(report).toEqual(mockReport);
    });
});
describe('createReport', () => {

    beforeEach(() => {
        jest.clearAllMocks();    
    })

    it('should create a report with valid data', async () => {
        const categoryId = '1';
        const category = { id: categoryId, get: jest.fn(() => ({ id: categoryId })) };
        const location = { get: jest.fn(() => ({ id: 1 })) };
        const mockReport = { id: 1, description: 'Test report' };
        const newReport: IReportRequest = {
            title: 'This is a test report',
            content: 'This is a test report',
            images: 'This is a test report',
            categoryId: '1',
            latitude: '50.33',
            longitude: '50.33',
        };

        (Category.findByPk as jest.Mock).mockResolvedValue(category);
        (Location.create as jest.Mock).mockResolvedValue(location);
        (Report.create as jest.Mock).mockResolvedValue(mockReport);
        

        const description = 'This is a test report';
        const createdReport = await reportFunctions.createReport(newReport);

        expect(createdReport).toEqual(mockReport);

        expect(Category.findByPk).toHaveBeenCalledWith(1);
        expect(Location.create).toHaveBeenCalledWith({ latitude: newReport.latitude, longitude: newReport.latitude });
        expect(Report.create).toHaveBeenCalledWith({
            title: description,
            content: description,
            duration: expect.any(Date),
            images: expect.any(String),
            CategoryId: category.id,
            LocationId: location.get().id
        });
    });

    it('should throw an error if the category does not exist', async () => {
        const newReport: IReportRequest = {
            title: 'This is a test report',
            content: 'This is a test report',
            images: 'This is a test report',
            categoryId: '1',
            latitude: '1',
            longitude: '1'
        };
        (Category.findByPk as jest.Mock).mockResolvedValue(null);

        await expect(reportFunctions.createReport(newReport)).rejects.toThrow('La categoría especificada no existe.');
        expect(Category.findByPk).toHaveBeenCalledWith(+newReport.categoryId);
    });
});


