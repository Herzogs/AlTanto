import {ReportMock} from '../mocks/report.mock'; // Importa el mock de Report
import {CategoryMock} from '../mocks/category.mock'; // Importa el mock de Category
import {LocationMock} from '../mocks/location.mock'; // Importa el mock de Location
import ReportRepository from '../../src/repository/reports.repository';
import {IReportDto} from '../../src/models/reports.interface';

describe('ReportRepositiry', () => {
    let reportRepository: ReportRepository;

    beforeAll(() => {
        reportRepository = new ReportRepository({Report: ReportMock, Category: CategoryMock, Location: LocationMock});
    })

    it('should create a new report', async () => {
        const newReport: IReportDto = {
            content: 'Report test 1',
            image: 'imageTest',
            category: "1",
            location: {
                latitude: 54,
                longitude: 55,
            },
            userId: 1
        };

        const reportCreated: IReportDto | null = await reportRepository.create(newReport);
        expect(reportCreated).toBeDefined();
        expect(reportCreated?.content).toEqual(newReport.content);
        expect(reportCreated?.id).toEqual(1);
    });
    it('should return report details when valid id is provided', async () => {
        // Mockear el reporte buscado por ID
        const mockReportId = 1;
        const reportExpected = await reportRepository.getById(mockReportId);
        expect(reportExpected?.content).toEqual("Report test 1")

    });
    it('should return null if category is not found', async () => {
        const newReport: IReportDto = {
            content: 'Report test 1',
            image: 'imageTest',
            category: "999", // ID de categoría que no existe en el mock
            location: {
                latitude: 54,
                longitude: 55,
            },
            userId: 1
        };


        CategoryMock.findByPk.mockResolvedValueOnce(null);

        const reportCreated: IReportDto | null = await reportRepository.create(newReport);


        expect(reportCreated).toBeNull();
    });

    it('should return null when invalid id is provided', async () => {

        const result = await reportRepository.getById(999);
        expect(ReportMock.findByPk).toHaveBeenCalledWith(999, expect.any(Object));

        expect(result).toBeNull();
    });
    it('should return reports for a specific user with 2 reports', async () => {
        const userId = 1;
        const reportsByUser = await reportRepository.getByUser(userId);
        expect(reportsByUser).toBeDefined();
        expect(reportsByUser).toHaveLength(2);
    })
    it('should return an empty array for a user with no reports', async () => {
        const userId = 3; // Usuario que no tiene reportes en el mock

        // Simular que el usuario 3 no tiene reportes asociados
        ReportMock.findAll.mockResolvedValueOnce([]);

        const reportsByUser = await reportRepository.getByUser(userId);

        expect(reportsByUser).toBeDefined();
        expect(reportsByUser).toHaveLength(0);
    });
    it('should disable old reports older than 2 days', async () => {
        // Simulamos el llamado al método update de sequelize
        const updateMock = jest.spyOn(ReportMock, 'update').mockResolvedValue([1]); // Suponiendo que se actualiza al menos un reporte

        await reportRepository.disableOldReports();


        expect(updateMock).toHaveBeenCalledTimes(1);
    });


    it('should log error if an error occurs during scoring', async () => {
        const reportId = 1;
        const vote = 1;

        const errorMessage = 'Database connection error';
        const mockError = new Error(errorMessage);

        // Simular un error al llamar a findByPk
        ReportMock.findByPk.mockRejectedValueOnce(mockError);

        // Configurar console.error para capturar los logs
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        await reportRepository.scoringReport(reportId, vote, 1);

        // Verificar que se haya registrado el error en los logs
        expect(consoleErrorSpy).toHaveBeenCalledWith(`Error while scoring report with id ${reportId}:`, mockError);
    });

    it('should not increment score if report is not found', async () => {
        const reportId = 999; // Reporte no existente

        // Simular que findByPk no encuentra el reporte
        ReportMock.findByPk.mockResolvedValueOnce(null);

        await reportRepository.scoringReport(reportId, 1, 1);

        // Verificar que no se haya llamado a increment en este caso
        expect(ReportMock.increment).not.toHaveBeenCalled();
    });

    it('should log error if an error occurs during scoring', async () => {
        const reportId = 1;
        const vote = 1;

        const errorMessage = 'Database connection error';
        const mockError = new Error(errorMessage);

        // Simular un error al llamar a findByPk
        ReportMock.findByPk.mockRejectedValueOnce(mockError);

        // Configurar console .error para capturar los logs
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

        await reportRepository.scoringReport(reportId, vote, 1);

        // Verificar que se haya registrado el error en los logs
        expect(consoleErrorSpy).toHaveBeenCalledWith(`Error while scoring report with id ${reportId}:`, mockError);
    });
    it('should handle case when report is not found', async () => {
        const reportId = 999;

        ReportMock.findByPk.mockResolvedValueOnce(undefined);

        const nothing = await reportRepository.scoringReport(reportId, 1, 1);

        expect(nothing).toBeUndefined()
    });


})


