/* eslint-disable @typescript-eslint/no-explicit-any */
const transformData = (plainData: any) => {
    const transformedReport = {
        ...plainData,
        category: plainData.Category ? {
            id: plainData.Category.id,
            name: plainData.Category.name
        } : null,
        location: plainData.Location ? {
            latitude: plainData.Location.latitude,
            longitude: plainData.Location.longitude
        } : null,
    };

    // Eliminar propiedades originales en mayúsculas
    delete transformedReport.Category;
    delete transformedReport.Location;
    return transformedReport
}

export default transformData;