import Report from '../models/Report';
import Category from '../models/Category';
import { Location } from '../models/Location';
import { IReportRequest, IReportResponse, IReportWithRadius } from '../interfaces/reports.interface';
import { QueryTypes } from 'sequelize';
import { Op } from 'sequelize';

class ReportRepository {
    static async getAll(): Promise<Report[]> {
        const listOfReports = await Report.findAll({
            where: { enabled: true },
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['CategoryId', 'LocationId'] }
        });
        if (!listOfReports) {
            return [];
        }
        console.log(listOfReports.map((report) => report.get({ plain: true })));
        return listOfReports.map((report) => report.get({ plain: true }));
    }

    static async getById(reportId: number): Promise<IReportResponse | null> {
        const reportSearched = await Report.findByPk(reportId, {
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['CategoryId', 'LocationId'] }
        });
        if (!reportSearched) {
            return null
        }
        return reportSearched.get({ plain: true });
    }

    static async getByUser(userId: number): Promise<IReportResponse[] | null> {
        const listOfReports = await Report.findAll({
            where: { userId: userId },
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['CategoryId', 'LocationId'] }
        });
        if (!listOfReports) {
            return [];
        }


        return listOfReports.map((report) => report.get({ plain: true }));
    }

    static async create(newReport: IReportRequest): Promise<IReportResponse | null> {
        const categorySearch = await Category.findByPk(newReport.categoryId);
        if (!categorySearch) {
            return null
        }
        const locationSearched = await Location.findOrCreate({
            where: { latitude: newReport.latitude, longitude: newReport.longitude },
        })
        const location = locationSearched[0].get({ plain: true });
        const reporCreated = await Report.create({
            title: newReport.title,
            content: newReport.content,
            duration: new Date(),
            CategoryId: newReport.categoryId,
            LocationId: location.id,
            images: newReport.images
        });
        return reporCreated.get({ plain: true }) as IReportResponse;
    }

    static async getByLatLongRadius(zoneWithRadius: IReportWithRadius): Promise<object[] | null> {
        const { lat, lon, rad } = zoneWithRadius;
        const reports = await Report.sequelize?.query(
            `SELECT Report.id, Report.title, Report.content, Report.images, Report.positiveScore, Report.negativeScore, Report.categoryId,
                Location.latitude, Location.longitude, 
                Category.name AS categoryName,
                (6371000 * acos(
                    least(1, cos(radians(:lat)) * cos(radians(Location.latitude)) * cos(radians(Location.longitude) - radians(:lon)) +
                    sin(radians(:lat)) * sin(radians(Location.latitude)))
                )) AS distancia
            FROM Location
            JOIN Report ON Location.id = Report.LocationId
            JOIN Category ON Report.CategoryId = Category.id
            HAVING distancia <= :radius
            ORDER BY distancia;`,
            {
                replacements: {
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    radius: parseFloat(rad)
                },
                type: QueryTypes.SELECT
            }
        );
        if (!reports) {
            return null;
        }
        return reports;
    }

    static async disableOldReport(): Promise<number> {
        const numberOfReportsDisabled = await Report.update({ enabled: false }, {
            where: {
                createAt: {
                    //[Op.lte]: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) // > 2 days
                    [Op.lte]: new Date(new Date().getTime() - 5 * 60 * 1000) //  > 1 hour
                }
            }
        });
        return numberOfReportsDisabled[0];
    }

}

export default ReportRepository;
