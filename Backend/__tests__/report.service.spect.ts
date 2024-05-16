import * as reportFunctions from '../src/services/report.service';
import {getAllReports} from "../src/services/report.service";
import Report from '../src/models/Report';
import Category from '../src/models/Category';
import Location from '../src/models/Location';


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
    it('should create a report with valid data', async () => {
        const categoryId = 1;
        const latitude = '50.1234';
        const newLongitude = 30.5678;
        const category = { id: categoryId, get: jest.fn(() => ({ id: categoryId })) };
        const location = { get: jest.fn(() => ({ id: 1 })) };
        const mockReport = { id: 1, description: 'Test report' };

        (Category.findByPk as jest.Mock).mockResolvedValue(category);
        (Location.create as jest.Mock).mockResolvedValue(location);
        (Report.create as jest.Mock).mockResolvedValue(mockReport);

        const description = 'This is a test report';
        const createdReport = await reportFunctions.createReport(description, categoryId, latitude, newLongitude);

        expect(createdReport).toEqual(mockReport);

        expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
        expect(Location.create).toHaveBeenCalledWith({ latitude, longitude: newLongitude });
        expect(Report.create).toHaveBeenCalledWith({
            description,
            fileId: null,
            duration: null,
            positiveScore: 0,
            negativeScore: 0,
            enabled: true,
            CategoryId: category.id,
            LocationId: location.get().id
        });
    });

    it('should throw an error if the category does not exist', async () => {
        (Category.findByPk as jest.Mock).mockResolvedValue(null);

        const description = 'This is a test report';
        const categoryId = 999;
        const latitude = '50.1234';
        const newLongitude = 30.5678;

        await expect(reportFunctions.createReport(description, categoryId, latitude, newLongitude)).rejects.toThrow('La categoría especificada no existe.');
        expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
    });
});


