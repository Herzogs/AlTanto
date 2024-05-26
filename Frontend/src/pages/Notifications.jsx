import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import Report from "../components/report/Report";
import { useNavigate } from "react-router-dom";

const WEATHER_API_KEY = '4450218ff88ddcaf2ed7c2d62de96b91';

const weatherDescriptionMap = {
  "shower rain": "Alerta de lluvia fuerte",
  "rain": "Alerta de lluvia",
  "thunderstorm": "Alerta de tormenta",
  "snow": "Alerta de nieve",
  "mist": "Alerta de niebla"
};

async function getReports() {
  try {
    const response = await fetch(`http://localhost:3000/api/reports`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getWeatherAlerts(latitude, longitude) {
  try {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&lang=en&units=metric`);
    if (!response.ok) {
      throw new Error("Error al obtener las alertas meteorológicas");
    }
    const data = await response.json();
    console.log(data);

    const alertCriteria = ["shower rain", "rain", "thunderstorm", "snow", "mist","clear sky"];

    const filteredAlerts = data.weather.filter(item =>
      alertCriteria.includes(item.description.toLowerCase())
    );

    const mappedAlerts = filteredAlerts.map(item => ({
      ...item,
      description: weatherDescriptionMap[item.description.toLowerCase()],
      iconUrl: `http://openweathermap.org/img/wn/${item.icon}@2x.png`
    }));

    return mappedAlerts;
  } catch (error) {
    throw new Error(error);
  }
}

function Notifications() {
  const [reports, setReports] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const reportsData = await getReports();
      setReports(reportsData);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          error => {
            console.error("Error getting geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      if (latitude !== null && longitude !== null) {
        // const weatherAlerts = await getWeatherAlerts(latitude, longitude);
        // const formattedWeatherAlerts = weatherAlerts.map((alerta, index) => ({
        //   id: `alerta-meteo-${index}`,
        //   tipe: 3, 
        //   title: "Alerta de clima",
        //   content: alerta.description,
        //   distancia: 0, 
        //   latitude: latitude,
        //   longitude: longitude,
        //   images: [],
        //   iconUrl: alerta.iconUrl
        // }));
  
        // setReports(prevReports => [...prevReports, ...formattedWeatherAlerts]);
      }
    }
  
    fetchWeather();
  }, [latitude, longitude]);

  const getIconByType = (tipe) => {
    switch (tipe) {
      case 1:
        return ErrorIcon;
      case 2:
        return InfoIcon;
      case 3:
        return InfoIcon; 
      default:
        return WarningIcon;
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/reportes/${id}`);
  };

  return (
    <Container>
      <h3>Mis notificaciones</h3>
      {reports.map((report) => (
        <Report
          key={report.id}
          report={report}
          title={report.title}
          description={report.content}
          iconUrl={report.iconUrl}
          icolor={"#cc545d"}
          onViewDetails={() => handleViewDetails(report.id)}
        />
      ))}
    </Container>
  );
}

export default Notifications;
