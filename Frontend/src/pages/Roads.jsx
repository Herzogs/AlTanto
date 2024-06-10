import {useEffect, useState} from 'react';
import { getRoutesByUserId } from '@services/getRoutesByUser';
import { userStore, useStore} from '@store';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Roads() {
    
    const [road, setRoad] = useState([]);

    useEffect(() => {
      useStore.getState().setReports([]);
      getRoutesByUserId(userStore.getState().user.id).then((data) => {
        setRoad(data);

      });
    }, []);
    
    return (
      <Container fluid className="pb-footer">
        <div className="text-center">
          <h1>Gestionar Rutas</h1>
          <Link to="/form/ruta" className="btn btn-success mt-3 px-4 py-3 fw-bold">
            Crear nueva ruta
          </Link>
        </div>
  
        {road && road.length > 0 ? (
          <>
            <h4 className="text-center mt-5 mb-4">Selecciona un recorrido para ver su información</h4>
            <article className="container_zonas-item container">
              {road.map((ruta) => (
                <div className="zonas-item" key={ruta.id}>
                  <h5>{ruta.name}</h5>
                  <Link
                    to={`/recorridos/${ruta.id}`}
                    className="btn btn-sm btn-primary text-white"
                  >
                    Ver detalle
                  </Link>
                </div>
              ))}
            </article>
          </>
        ) : (
          <h4 className="text-center mt-5">Todavia no tienes Rutas guardadas</h4>
        )}
      </Container>
    );
}
export default Roads