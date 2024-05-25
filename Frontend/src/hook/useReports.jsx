import { useStore } from "../store";
import { getReports } from "../services/getReports";

function useReports() {
  const { userLocation, radiusZone, setReports } = useStore();

  const fetchReports = async () => {
    if (userLocation) {
      try {
        const response = await getReports(userLocation, radiusZone);
        setReports(response);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }
  };

  return { fetchReports };
}

export default useReports;
