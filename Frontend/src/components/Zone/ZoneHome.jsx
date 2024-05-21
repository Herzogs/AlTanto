import { useState, useEffect } from 'react'

function ZoneHome() {
    const [zones, setZones] = useState([]);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/zone');
                const data = await response.json();
                setZones(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchZones();
    }, []);

    return (
        <>
            <h1 className='text-center'>Mis Zonas</h1>

            <h2>Selecciona una zona para ver su información</h2>

            <h3>Lista de zonas</h3>
            <a href='/zonas/crear'>Crear nueva zona</a>
            <ul>
                {zones.map((zone) => (
                    <a key={zone.id} href={`/zonas/${zone.id}`}> Ir a {zone.name}</a>
                ))}
            </ul>
        
        </>
    )
}

export default ZoneHome