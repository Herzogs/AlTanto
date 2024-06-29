/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { memo } from "react";
import Slider from "react-slick";
import Report from "@components/report/Report";
import { settings } from "@components/slider/settings";
import { useStore } from "@store";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SliderAT({ reports: propReports }) {
  const { reports: storeReports } = useStore();
  const reports = propReports || storeReports;

  return (
    <>
      {reports.length < 2 ? (
        <div className="d-flex gap-3">
          {reports.map((report) => (
            <Report key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="slider-container">
          <Slider {...settings}>
            {reports.map((report) => (
              <Report key={report.id} report={report} />
            ))}
          </Slider>
        </div>
      )}
    </>
  );
}

export default memo(SliderAT);
