import Report from '../models/Report';
import Category from "../models/Category";
import Location from '../models/Location';

async function getAllReports(): Promise<Report[]> {
    return await Report.findAll({
        include: [
            {model: Category, attributes: ['name']},
            {model: Location, attributes: ['latitude', 'longitude']}
        ]
    });
}

async function getReportById(reportId: number): Promise<Report | null> {
    return await Report.findByPk(reportId, {
        include: [
            {model: Category, attributes: ['name']},
            {model: Location, attributes: ['latitude', 'longitude']}
        ]
    });
}


async function getReportByUser(userId: number): Promise<Report[]> {
    return await Report.findAll({
        where: {userId: userId},
        include: [
            {model: Category, attributes: ['name']},
            {model: Location}
        ]
    });
}

async function createReport(description: string, categoryId: number, latitude: string, newLongitude: number): Promise<Report | void> {
    return Category.findByPk(categoryId)
        .then(async (category) => {
            if (!category) {
                throw new Error("La categoría especificada no existe.");
            }
            const location = await Location.create({latitude, longitude: newLongitude});
            return await Report.create({
                description,
                fileId: null,
                duration: null,
                positiveScore: 0,
                negativeScore: 0,
                enabled: true,
                CategoryId: category.get().id,
                LocationId: location.get().id
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
        await loca.update({latitude: newLatitude, longitude: newLongitude});
        const category = await Category.findByPk(newCategory);
        if (!category) {
            throw new Error("La categoría especificada no existe.");
        }
        const [rowsUpdated, updatedReports] = await Report.update({
            description,
            CategoryId: newCategory,
            Location: loca

        }, {
            where: {id: reportId},
            returning: true
        });
        return [rowsUpdated, updatedReports];
}

async function deleteReport(reportId: number): Promise<number> {
    return await Report.destroy({
        where: {id: reportId}
    });

}

export {
    getAllReports,
    getReportById,
    getReportByUser,
    createReport,
    updateReport,
    deleteReport
};
