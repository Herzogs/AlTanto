import { useStore } from "@store";
import { getReportsBy } from "@services/getReportsByLocationAndRadius";

function useReports() {
  const { userLocation, radiusZone, setReports, oldUserLocation, setDistance } = useStore();

  const fetchReports = async () => {
    if (userLocation) {
      
      if (oldUserLocation) {
        const dist = userLocation.distanceTo(oldUserLocation);
        if (dist < 100) {
          return;
        }
        setDistance(dist);
      }
      try {
        const response = await getReportsBy(userLocation, radiusZone);
        setReports(response);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
  };

  return { fetchReports };
}

export default useReports;
