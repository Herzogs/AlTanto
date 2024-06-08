import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-contextmenu-bootstrap';
import { useEffect } from 'react';

const ContextMenu = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    L.control.contextMenu({
      contextmenu: true,
      contextmenuWidth: 140,
      contextmenuItems: [
        {
          text: 'Generar reporte automatico',
          callback: () => map.zoomIn(),
        },
        {
          text: 'Zoom out',
          callback: () => map.zoomOut(),
        },
        
        {
          text: 'Get coordinates',
          callback: (e) => {
            const { lat, lng } = e.latlng;
            alert(`Latitude: ${lat}, Longitude: ${lng}`);
          },
        },
      ],
    }).addTo(map);
  }, [map]);

  return null;
};


export default ContextMenu;
