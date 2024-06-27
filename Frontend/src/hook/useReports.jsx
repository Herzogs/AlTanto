import { useStore } from "@store";
import { getReportsBy } from "@services/getReportsByLocationAndRadius";

function useReports() {
  const { userLocation, radiusZone, setReports } = useStore();

  const fetchReports = async () => {
    if (userLocation) {
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
