import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Map from "@components/Map/Map.jsx";
import { useStore } from "@store";
import useReports from "@hook/useReports";
import getZone from "@services/getZone";
import ModalAT from "@components/modal/ModalAT";
import CategoryFilter from "@components/Map/CategoryFilter";

function ZoneHome() {
  const {
    userLocation,
    setUserLocation,
    radiusZone,
    setRadiusZone,
    setMarkerPosition,
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zona, setZona] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!id) throw new Error("El id de la zona no es válido");
      setMarkerPosition(null);
      getZone(id)
        .then((data) => {
          setRadiusZone(data.radio);
          setUserLocation({
            lat: data.location.latitude,
            lng: data.location.longitude,
          });
          setZona(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setShowModal(true);
        });
    } catch (error) {
      setError(error.message);
      setShowModal(true);
    }
  }, [id, setRadiusZone]);

  const { fetchReports } = useReports();

  useEffect(() => {
    if (userLocation) {
      fetchReports();
    }
  }, [userLocation, radiusZone]);

  return (
    <>
      {!loading && (
        <section className="container_home">
          <h2 className="text-center mt-4 mb-5">{zona.name}</h2>

          <div className="h-map">
            <Map
              userLocation={userLocation}
              radiusZone={radiusZone}
              CategoryFilterComponent={CategoryFilter}
              mapClick={true}
              noCircle={false}
            />
          </div>

          {!error && (
            <ModalAT
              title="Encontramos un error"
              message={error}
              showModal={showModal}
              handleClose={() => navigate("/zonas")}
              handleAccept={() => navigate("/zonas")}
            />
          )}
        </section>
      )}
    </>
  );
}

export default ZoneHome;
