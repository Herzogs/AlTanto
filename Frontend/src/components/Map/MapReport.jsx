/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { icons } from "./Icons";
import PopupAT from "@components/Map/PopupAT";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { Marker } from "react-leaflet";
import { useStore } from "@store";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";

const MapReport = ({ selectedCategories }) => {
    const { reports } = useStore();
    const filteredReports = useMemo(() => {
        return reports && reports.length > 0
            ? reports.filter(report => selectedCategories.includes(report.category.id))
            : [];
    }, [reports, selectedCategories]);

    const iconsMap = useMemo(() => ({
        1: icons.category1,
        2: icons.category2,
        3: icons.category3,
        4: icons.category4,
    }), []);

    const getIconByCategoryId = useMemo(() => (categoryId) => {
        return iconsMap[categoryId] || icons.default;
    }, [iconsMap]);
    
    return (
        <>
            {filteredReports.length > 0 && (
                <MarkerClusterGroup>
                    {filteredReports.map((report) => (
                        <Marker
                            key={report.id}
                            position={[report.location.latitude, report.location.longitude]}
                            icon={getIconByCategoryId(report.category.id)}
                        >
                            <PopupAT report={report} />
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            )}
        </>
    );
}

export default MapReport;
