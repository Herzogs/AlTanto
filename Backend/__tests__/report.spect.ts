import Report from '../src/models/Report';
import Category from '../src/models/Category';
import Location from '../src/models/Location';

describe('Report Model', () => {
    it('should create a new report', async () => {
        const category = await Category.create({ name: 'Test Category' });
        const location = await Location.create({ latitude: '123', longitude: '456' });
        const newReport = await Report.create({
            description: 'Test Report',
            dateTime: new Date(),
            fileId: 'test-file-id',
            duration: new Date(),
            positiveScore: 1,
            negativeScore: 0,
            enabled: true,
            CategoryId: category.get().id,
            LocationId: location.get().id
        });

        expect(newReport).toBeDefined();
        expect(newReport.get().description).toBe('Test Report');
        expect(newReport.get().CategoryId).toBe(category.get().id);
        expect(newReport.get().LocationId).toBe(location.get().id);
    });
});