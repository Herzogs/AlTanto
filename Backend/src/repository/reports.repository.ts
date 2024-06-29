import Report from "./entities/Report";
import Category from "./entities/Category";
import { Location } from "./entities/Location";
import { IReportDto } from "../models/reports.interface";
import { ModelCtor } from "sequelize";
import { IReportRepository } from "./interface/report.repository.interface";

class ReportRepository implements IReportRepository<IReportDto> {
    private reportModel: ModelCtor<Report>;

    constructor({ Report }: { Report: ModelCtor<Report> }) {
        this.reportModel = Report;
    }

    async getAll(): Promise<IReportDto[]> {
        try {
            const listOfReports = await this.reportModel.findAll({
                where: { enabled: true },
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: Location, attributes: ['latitude', 'longitude'] }
                ],
                attributes: { exclude: ['CategoryId', 'LocationId'] }
            });

            return listOfReports.map(report => report.get({ plain: true })) as IReportDto[];
        } catch (error) {
            console.error("Error in getAll reports:", error);
            return [];
        }
    }

    async getById(reportId: number): Promise<IReportDto | null> {
        try {
            const reportSearched = await this.reportModel.findByPk(reportId, {
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: Location, attributes: ['latitude', 'longitude'] }
                ],
                attributes: { exclude: ['CategoryId', 'LocationId'] }
            });
            if (!reportSearched) {
                return null;
            }
            return reportSearched.get({ plain: true }) as IReportDto;
        } catch (error) {
            console.error(`Error while fetching report with id ${reportId}:`, error);
            return null;
        }
    }

    async create(newReport: IReportDto): Promise<IReportDto | null> {
        try {

            const categorySearch = await Category.findByPk(newReport.category);
            if (!categorySearch) {
                return null
            }

            const locationSearched = await Location.findOrCreate({
                where: { latitude: newReport.location.latitude, longitude: newReport.location.longitude },
            })
            const location = locationSearched[0].get({ plain: true });

            const reporCreated = await this.reportModel.create({
                content: newReport.content,
                CategoryId: newReport.category,
                LocationId: location.id,
                images: newReport.image,
                groupId: newReport.groupId,
                userId: newReport.userId
            });
            const reportPlain = reporCreated.get({ plain: true });
            return {
                id: reportPlain.id,
                content: reportPlain.content,
                category: categorySearch.get({ plain: true }),
                location: {
                    latitude: +location.latitude,
                    longitude: +location.longitude
                },
                image: reportPlain.images,
                groupId: reportPlain.groupId,
                userId: reportPlain.userId
            }
        } catch (error) {
            console.error("Error while creating report:", error);
            return null;
        }
    }

    async getByUser(userId: number): Promise<IReportDto[]> {
        try {
            const listOfReports = await this.reportModel.findAll({
                where: { userId: userId },
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: Location, attributes: ['latitude', 'longitude'] }
                ],
                attributes: { exclude: ['CategoryId', 'LocationId'] }
            });

            return listOfReports.map(report => report.get({ plain: true })) as IReportDto[];
        } catch (error) {
            console.error(`Error while fetching reports for user with id ${userId}:`, error);
            return [];
        }
    }



    async disableOldReports(): Promise<void> {
        await this.reportModel.update({ enabled: false }, {
            where: {
                createdAt: {
                    $lt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) // > 2 days
                    //[Op.lte]: new Date(new Date().getTime() - 5 * 60 * 1000) //  > 1 hour
                }
            }
        });
    }

    async getByGroup(groupId: number): Promise<IReportDto[]> {
        try {
            const listOfReports = await this.reportModel.findAll({
                where: { groupId: groupId },
                include: [
                    { model: Category, attributes: ['id', 'name'] },
                    { model: Location, attributes: ['latitude', 'longitude'] }
                ],
                attributes: { exclude: ['CategoryId', 'LocationId'] }
            });

            return listOfReports.map(report => report.get({ plain: true })) as IReportDto[];
        } catch (error) {
            console.error(`Error while fetching reports for group with id ${groupId}:`, error);
            return [];
        }
    }

    async scoringReport(id: number, vote: number, _userId: number): Promise<void> {
        try {
            const report = await this.reportModel.findByPk(id);
            if (!report) {
                return;
            }
            if (vote === 1) {
                await report.increment('positiveScore');
            } else {
                await report.increment('negativeScore');
            }

        } catch (error) {
            console.error(`Error while scoring report with id ${id}:`, error);
        }
    }

    async reportRoad(routeCoordinates: { lat: number, lng: number }[], maxDistance: number): Promise<object[]> {
        try {
            const conditions = routeCoordinates.map((c, index) => {
                if (index === 0) return ''; // Ignorar el primer punto de la ruta para evitar duplicados en la consulta
                return `
                    ST_Distance(
                        POINT(${c.lng}, ${c.lat}),
                        POINT(l.longitude, l.latitude)
                    ) < ${maxDistance}
                `;
            }).filter(condition => condition !== '').join(' OR ');

            const [results] = await Report.sequelize?.query(`
                SELECT DISTINCT 
                    r.id, 
                    r.content, 
                    r.createAt, 
                    r.images, 
                    r.positiveScore, 
                    r.negativeScore,
                    c.id AS categoryId, 
                    c.name AS categoryName,
                    u.name AS userName,
                    u.lastName as userLastName,
                    l.latitude as latitude, 
                    l.longitude AS longitude
                FROM Report r
                JOIN Location l ON r.LocationId = l.id
                JOIN Category c ON r.CategoryId = c.id
                JOIN User u ON r.userId = u.id
                WHERE (${conditions})
            `) || [[], []];

            const arrayOfReports: object[] = results.map((report: any) => ({
                id: report.id,
                content: report.content,
                createAt: report.createAt,
                images: report.images,
                positiveScore: report.positiveScore,
                negativeScore: report.negativeScore,
                category: {
                    id: report.categoryId,
                    name: report.categoryName
                },
                location: {
                    latitude: report.latitude,
                    longitude: report.longitude
                },
                user: {
                    name: report.userName,
                    lastName: report.userLastName
                }
            }));

            return arrayOfReports;
        } catch (error) {
            console.error("Error while reporting along route:", error);
            return [];
        }
    }

    async disableNegativeReports(): Promise<void> {
        await this.reportModel.update({ enabled: false }, {
            where: {
                negativeScore: {
                    $gte: 10
                }
            }
        });
    }

}


export default ReportRepository;
