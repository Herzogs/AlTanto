import Category from "./entities/Category";
import Report from "./entities/Report";
import { Location } from "./entities/Location";
import { IReportDto} from "../models/reports.interface";
import { ModelCtor } from "sequelize";
import { IReportRepository } from "./interface/report.repository.interface";

class ReportRepository implements IReportRepository<IReportDto>{

    private reportModel: ModelCtor<Report>;

    constructor({ Report }: { Report: ModelCtor<Report> }) {
        this.reportModel = Report;
    }

    async getAll(): Promise<IReportDto[]> {
        const listOfReports = await this.reportModel.findAll({
            where: {
                enabled: true
            },
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['CategoryId', 'LocationId'] }
        })
        if (!listOfReports) {
            return [];
        }

        console.log(listOfReports.map((report) => report.get({ plain: true })) as IReportDto[]);
        return listOfReports.map((report) => report.get({ plain: true })) as IReportDto[];
    }

    async getById(reportId: number): Promise<IReportDto | null> {
        const reportSearched = await this.reportModel.findByPk(reportId, {
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Location, attributes: ['latitude', 'longitude'] }
            ],
            attributes: { exclude: ['CategoryId', 'LocationId'] }
        });
        if (!reportSearched) {
            return null
        }
        return reportSearched.get({ plain: true }) as IReportDto;
    }

    async getByUser(userId: number): Promise<IReportDto[] | null> {
        const listOfReports = await this.reportModel.findAll({
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

    async create(newReport: IReportDto): Promise< IReportDto | null> {
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
            groupId: newReport.groupId
        });
        return reporCreated.get({ plain: true }) as IReportDto;
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
        const listOfReports = await this.reportModel.findAll({
            where: { groupId: groupId },
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Location, attributes: ['latitude', 'longitude'] },
            ],
            attributes: { exclude: ['CategoryId', 'LocationId'] }

        });
        if (!listOfReports) {
            return [];
        }
        return listOfReports.map((report) => report.get({ plain: true }));
    }
}

export default ReportRepository;
