import axiosInstance from '@interceptors/axiosConfig';

const fetchReports = async (routeCoordinates, numSegments) => {
    const response = await axiosInstance.post('/reports/road', {
        coordinates: routeCoordinates,
        segments: numSegments
    });
    console.log(response)
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error("Error fetching reports");
    }
}

export { fetchReports };