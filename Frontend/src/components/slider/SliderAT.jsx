/* eslint-disable react/prop-types */
import Slider from "react-slick";
import Report from "@components/report/Report";
import { settings } from "@components/slider/settings";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SliderAT({ reports }) {
  return (
    <>
      {reports && reports.length > 0 ? (
        reports.length < 2 ? (
          <div className="d-flex gap-3">
            {reports.map((report) => (
              <Report key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="slider-container pb-5">
            <Slider {...settings}>
              {reports.map((report) => (
                <Report key={report.id} report={report} />
              ))}
            </Slider>
          </div>
        )
      ) : (
        <h4>Sin reportes</h4>
      )}
    </>
  );
}

export default SliderAT;
