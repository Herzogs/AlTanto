
const axios = require('axios');
const { json } = require('express');

// Función para obtener todos los puntos por donde pasa un recorrido
async function obtenerPuntosDeRecorrido(puntoInicio, puntoDestino) {
    try {
        // Construir la cadena de puntos de inicio y destino
        const puntoInicioStr = `${puntoInicio[1]},${puntoInicio[0]}`;
        const puntoDestinoStr = `${puntoDestino[1]},${puntoDestino[0]}`;

       
        // Construir URL de la solicitud al servicio de rutas de OpenStreetMap (OSRM)
        const url = 'http://router.project-osrm.org/route/v1/driving/'+puntoInicioStr+';'+puntoDestinoStr+'?alternatives=false&steps=true&geometries=polyline6&overview=full&annotations=true'
       
        //var response = await axios.get(url);
        var response = {"code":"Ok","routes":[{"geometry":"nuubaApxcvnBqIzLqh@lw@el@cq@ef@rs@}`AjuAqk@jy@eT`\\ma@xj@k^dh@_Vb]oXx`@","legs":[{"steps":[{"geometry":"nuubaApxcvnBqIzLqh@lw@","maneuver":{"bearing_after":313,"bearing_before":0,"location":[-58.575257,-34.663784],"type":"depart"},"mode":"driving","driving_side":"right","name":"General Ocampo","intersections":[{"out":0,"entry":[true],"bearings":[313],"location":[-58.575257,-34.663784]},{"out":3,"in":1,"entry":[false,false,true,true],"bearings":[45,135,225,315],"location":[-58.575479,-34.663615]}],"weight":17.8,"duration":17.8,"distance":138.5},{"geometry":"jatbaAz~evnBel@cq@","maneuver":{"bearing_after":42,"bearing_before":310,"location":[-58.576382,-34.66295],"modifier":"right","type":"turn"},"mode":"driving","driving_side":"right","name":"Miró","intersections":[{"out":0,"in":1,"entry":[true,false,true,true],"bearings":[45,135,225,315],"location":[-58.576382,-34.66295]}],"weight":17.6,"duration":17.6,"distance":108.8},{"geometry":"dtrbaAvldvnBef@rs@}`AjuAqk@jy@eT`\\ma@xj@k^dh@_Vb]oXx`@","maneuver":{"bearing_after":310,"bearing_before":42,"location":[-58.57558,-34.662227],"modifier":"left","type":"turn"},"mode":"driving","driving_side":"right","name":"Avenida Presidente Juan Domingo Perón","intersections":[{"out":3,"in":2,"entry":[true,true,false,true],"bearings":[45,135,225,315],"location":[-58.57558,-34.662227]},{"out":3,"in":1,"entry":[true,false,false,true],"bearings":[45,135,225,315],"location":[-58.576422,-34.6616]},{"out":3,"in":1,"entry":[true,false,true,true],"bearings":[45,135,225,315],"location":[-58.577804,-34.660545]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[45,135,315],"location":[-58.578738,-34.659832]},{"out":2,"in":0,"entry":[false,true,true],"bearings":[135,225,315],"location":[-58.579203,-34.659493]},{"out":2,"in":1,"entry":[true,false,true],"bearings":[45,135,315],"location":[-58.579904,-34.658942]},{"out":3,"in":1,"entry":[true,false,true,true],"bearings":[45,135,225,315],"location":[-58.580563,-34.65844]},{"out":2,"in":0,"entry":[false,false,true],"bearings":[135,225,315],"location":[-58.581045,-34.658072]}],"weight":60.200000000,"duration":60.200000000,"distance":747.8},{"geometry":"~vibaAbdpvnB","maneuver":{"bearing_after":0,"bearing_before":312,"location":[-58.581586,-34.657664],"type":"arrive"},"mode":"driving","driving_side":"right","name":"Avenida Presidente Juan Domingo Perón","intersections":[{"in":0,"entry":[true],"bearings":[132],"location":[-58.581586,-34.657664]}],"weight":0,"duration":0,"distance":0}],"summary":"General Ocampo, Avenida Presidente Juan Domingo Perón","weight":95.6,"duration":95.6,"annotation":{"metadata":{"datasource_names":["lua profile"]},"datasources":[0,0,0,0,0,0,0,0,0,0,0],"weight":[3.2,12.5,12.2,7.8,12.9,8.7,4.3,6.7,6.2,4.5,5.1],"nodes":[317681042,317681075,317681035,317681030,317681143,317681124,317681112,317681212,317681382,317681370,317681399,317681196],"distance":[27.666521019,110.865215529,108.790708123,103.888565062,172.451271685,116.547891900,56.836705486,88.677411997,82.151918969,60.149408157,67.133455341],"duration":[3.2,12.5,12.2,7.8,12.9,8.7,4.3,6.7,6.2,4.5,5.1],"speed":[8.6,8.9,8.9,13.3,13.4,13.4,13.2,13.2,13.3,13.4,13.2]},"distance":995.2}],"weight_name":"routability","weight":95.6,"duration":95.6,"distance":995.2}],"waypoints":[{"hint":"w7RggyG1YINEAAAAIAAAAAAAAAAAAAAADmNzQglV3UEAAAAAAAAAAEQAAAAgAAAAAAAAAAAAAADAdAAAZzaC_JgS7_2CNoL8sBLv_QAAjxOaMtDp","distance":3.634779622,"name":"General Ocampo","location":[-58.575257,-34.663784]},{"hint":"SrZgg1G4YIMCAAAAMwAAAAAAAAAAAAAAmiA-QFREhkIAAAAAAAAAAAIAAAAzAAAAAAAAAAAAAADAdAAArh2C_IAq7_2-HYL8jirv_QAATwiaMtDp","distance":2.135952024,"name":"Avenida Presidente Juan Domingo Perón","location":[-58.581586,-34.657664]}]}


        var puntos = response.routes[0].legs[0]


        return puntos;
    } catch (error) {
        console.error('Error al obtener puntos de recorrido:', error.message);
        throw error;
    }
}

const puntoInicio = [-34.66376, -58.57523]; // Punto de inicio del recorrido
const puntoDestino = [-34.65765, -58.58157]; // Punto de destino del recorrido

obtenerPuntosDeRecorrido(puntoInicio, puntoDestino)
    .then(puntos => {
        console.log('Puntos de recorrido:', puntos);
    })
    .catch(error => {
        console.error('Error:', error);
    });
