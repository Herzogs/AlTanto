import Report from "./entities/Report";
import Category from "./entities/Category";
import {Location} from "./entities/Location";
import {IReportDto} from "../models/reports.interface";
import {ModelCtor} from "sequelize";
import {IReportRepository} from "./interface/report.repository.interface";

class ReportRepository implements IReportRepository<IReportDto> {
    private reportModel: ModelCtor<Report>;
    private categoryModel: ModelCtor<Category>;
    private locationModel: ModelCtor<Location>;

    constructor({ Report, Category, Location }: { Report: ModelCtor<Report> , Category: ModelCtor<Category>, Location :ModelCtor<Location>}) {
        this.reportModel = Report;
        this.categoryModel= Category;
        this.locationModel=Location;
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
            const categorySearch = await this.categoryModel.findByPk(+newReport.category);
            if (!categorySearch) {
                return null
            }
            const locationSearched = await this.locationModel.findOrCreate({
                where: { latitude: newReport.location.latitude, longitude: newReport.location.longitude },
            })
            const location = locationSearched[0].get({ plain: true });

            const reportCreated = await this.reportModel.create({
                content: newReport.content,
                CategoryId: newReport.category,
                LocationId: location.id,
                images: newReport.image,
                groupId: newReport.groupId,
                userId: newReport.userId
            });
            const reportPlain = reportCreated.get({ plain: true });
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
            if (report === null) {
                return;
            }
            if (vote === 1) {
                await this.reportModel.increment('positiveScore', { where: { id: id } });
            } else {
                await this.reportModel.increment('negativeScore', { where: { id: id } });
            }
        } catch (error) {
            console.error(`Error while scoring report with id ${id}:`, error);

        }
    }
}

export default ReportRepository;
