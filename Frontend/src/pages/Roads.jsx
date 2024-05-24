import React, { useEffect } from 'react'
import { useStore } from '../store';
import Map from '../components/map/Map';

function Roads() {
  const { userLocation, radiusZone, routingMode, setRoutingMode } =
    useStore();

    useEffect(() => {
      setRoutingMode(true)
    }, [])
    

  return (
    <section className="container_home">
      <Map userLocation={userLocation} radius={radiusZone} routingMode={routingMode} />
    </section>
  )
}

export default Roads