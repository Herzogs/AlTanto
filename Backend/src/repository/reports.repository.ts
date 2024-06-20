import Report from "./entities/Report";
import Category from "./entities/Category";
import {Location} from "./entities/Location";
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
            const existingReport = await this.reportModel.findOne({
                where: {
                    content: newReport.content,
                    categoryId: Number(newReport.category),
                    '$location.latitude$': newReport.location.latitude,
                    '$location.longitude$': newReport.location.longitude,
                },
                include: [{ model: Location, attributes: [] }],
            });

            if (existingReport) {
                console.log(`Report with content '${newReport.content}' already exists.`);
                return null;
            }

            const categorySearch = await Category.findByPk(Number(newReport.category));
            if (!categorySearch) {
                console.error(`Category with id ${newReport.category} not found.`);
                return null;
            }

            const [locationSearched] = await Location.findOrCreate({
                where: { latitude: newReport.location.latitude, longitude: newReport.location.longitude },
            });

            if (!locationSearched) {
                console.error(`Failed to create or find location for report.`);
                return null;
            }

            const reportCreated = await this.reportModel.create({
                content: newReport.content,
                categoryId: Number(newReport.category),
                locationId: locationSearched.id,
                file: newReport.image || '',
                duration: 0,
                positiveScore: 0,
                negativeScore: 0,
                enabled: true,
            });

            return reportCreated.toJSON() as IReportDto;
        } catch (error) {
            console.error("Error while creating report:", error);
            return null;
        }
    }

    async disableOldReports(): Promise<void> {
        try {
            await this.reportModel.update({ enabled: false }, {
                where: {
                    createdAt: {
                        $lt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) // > 2 days
                    }
                }
            });
        } catch (error) {
            console.error("Error while disabling old reports:", error);
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
}

export default ReportRepository;
