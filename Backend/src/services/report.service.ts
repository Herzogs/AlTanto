import Report from '../models/Report';
import Category from "../models/Category";
import { Location, findEntitiesWithinRadius } from '../models/Location';
import { IReportRequest } from 'interfaces/reports.interface';
import { QueryTypes } from 'sequelize';

async function getAllReports(): Promise<Report[]> {
    return await Report.findAll({
        include: [
            { model: Category, attributes: ['name'] },
            { model: Location, attributes: ['latitude', 'longitude'] }
        ]
    });
}

async function getReportById(reportId: number): Promise<Report | null> {
    return await Report.findByPk(reportId, {
        include: [
            { model: Category, attributes: ['name'] },
            { model: Location, attributes: ['latitude', 'longitude'] }
        ]
    });
}


async function getReportByUser(userId: number): Promise<Report[]> {
    return await Report.findAll({
        where: { userId: userId },
        include: [
            { model: Category, attributes: ['name'] },
            { model: Location }
        ]
    });
}

async function createReport(newReport: IReportRequest): Promise<Report> {
    return Category.findByPk(+newReport.categoryId)
        .then(async (category) => {
            if (!category) {
                throw new Error("La categoría especificada no existe.");
            }
            const locationSearched = await Location.findOne({
                where: {
                    latitude: newReport.latitude,
                    longitude: newReport.longitude
                }
            });
            let location: Location;
            if (!locationSearched) {
                location = await Location.create({ latitude: newReport.latitude, longitude: newReport.longitude });
            } else {
                location = locationSearched;
            }
            console.log(location + ' location')
            const loc = location.get({ plain: true })
            console.log(loc + ' loc')
            return await Report.create({
                title: newReport.title,
                content: newReport.content,
                duration: new Date(),
                CategoryId: newReport.categoryId,
                LocationId: loc.id,
                images: newReport.images
            });
        })
        .catch((error) => {
            throw error;
        });
}

async function updateReport(reportId: number, description: string, newCategory: number, newLatitude: string, newLongitude: string): Promise<[number, Report[]]> {

    const report = await Report.findByPk(reportId);
    if (!report) {
        throw new Error("El reporte especificado no existe.");
    }
    const loca = await Location.findByPk(report.get().LocationId);
    if (!loca) {
        throw new Error("El reporte especificado no existe.");
    }
    await loca.update({ latitude: newLatitude, longitude: newLongitude });
    const category = await Category.findByPk(newCategory);
    if (!category) {
        throw new Error("La categoría especificada no existe.");
    }
    const [rowsUpdated, updatedReports] = await Report.update({
        description,
        CategoryId: newCategory,
        Location: loca

    }, {
        where: { id: reportId },
        returning: true
    });
    return [rowsUpdated, updatedReports];
}

async function deleteReport(reportId: number): Promise<number> {
    return await Report.destroy({
        where: { id: reportId }
    });

}

async function searchReportWithinTheRadius(location: Location, radius: number): Promise<Report[]> {
    return await findEntitiesWithinRadius(Report, location, radius);
}

const getReportsByLatLongRadius = async (lat: string, lon: string, radius: string): Promise<object[] | undefined> => {
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
                radius: parseFloat(radius)
            },
            type: QueryTypes.SELECT
        }
    );
    return reports; // Devuelve los reports obtenidos
}


export {
    getAllReports,
    getReportById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport,
    searchReportWithinTheRadius,
    getReportsByLatLongRadius
};

