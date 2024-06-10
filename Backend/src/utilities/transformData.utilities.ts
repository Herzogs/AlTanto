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
        origin: plainData.origin ? {
            latitude: plainData.origin.latitude,
            longitude: plainData.origin.longitude
        } : null,
        destination: plainData.destination ? {
            latitude: plainData.destination.latitude,
            longitude: plainData.destination.longitude
        } : null,
    };

    // Eliminar propiedades originales en mayúsculas
    delete transformedReport.Category;
    delete transformedReport.Location;
    if (transformedReport.category === null) {
        delete transformedReport.category;
    }
    if (transformedReport.location === null) {
        delete transformedReport.location;
    }
    if (transformedReport.origin === null) {
        delete transformedReport.origin;
    }
    if (transformedReport.destination === null) {
        delete transformedReport.destination;
    }
    return transformedReport
}

export default transformData;