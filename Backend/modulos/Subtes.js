const axios = require('axios');


function notificacionesSubtes(connection, callback) {
    obtenerDatosDeAPI()
        .then(validarRespuesta)
        .then(data => procesarGuardadoDeAlertas(data, connection))
        .catch(manejarError);
}

function obtenerDatosDeAPI() {
    const client_id = '431350e535634502832e3bf55d781f69';
    const client_secret = 'b1E507533480471f8A72032Bb3Ea6ddA';
    const link = `https://apitransporte.buenosaires.gob.ar/subtes/serviceAlerts?json=1&client_id=${client_id}&client_secret=${client_secret}`;
    //https://apitransporte.buenosaires.gob.ar/console/
     //const respuesta = {"header":{"gtfs_realtime_version":"1.0","incrementality":0,"timestamp":1525802328},"entity":{"active_period":[{"start":1525888786,"end":1525888983},{"start":1525890087,"end":1525989878}],"informed_entity":[{"agency_id":"","route_id":"","route_type":0,"stop_id":""}],"cause":3,"effect":3,"header_text":[{"text":"Servicio con demoras - 60","language":"es"},{"text":"Significant delays - 60","language":"en"}],"description_text":[{"text":"Línea 60 - Servicio con demora por problemas técnicos","language":"es"},{"text":"60 - Significant delays due to technical problems","language":"en"}]}}
 
    return axios.get(link);
}

function validarRespuesta(respuesta) {

        if (respuesta.status !== 200) {
            throw new Error(`Error: Estado de respuesta no es 200 OK (${respuesta.status})`);
        }        
        // Verificar que la respuesta tenga un formato JSON
        const contentType = respuesta.headers['content-type'];
        if (!/^application\/json/.test(contentType)) {
            throw new Error(`Error: Tipo de contenido de respuesta no es JSON (${contentType})`);
        }
        return respuesta.data;  

}

function guardarTipo_notificacion(connection, alertId){
    connection.query('SELECT * FROM tipo_notificacion WHERE nombre = ? ', [alertId], (err, idTipo_Notificacion) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            reject(err);
        } else {
            if (idTipo_Notificacion.length == 0) {
              
                connection.query('INSERT INTO tipo_notificacion (nombre , grupo) VALUES (? ,"subte")', [alertId], (err, results) => {
                    if (err) {
                        console.error('Error al insertar tipo_notificacion:', err);
                        reject(err);                                
                    }
             });
          } 
        }
    });
}


function procesarGuardadoDeAlertas(data, connection) {
    return new Promise((resolve, reject) => {

        data.entity.forEach(alerta => {
            let alertId = alerta.id; // ID de la alert: Alert_LineaB

            if (alerta.alert) {

                const textoAlerta = alerta.alert.header_text.translation[0].text;              
                console.log('ID de la alerta:', alertId);
                console.log('Texto de la alerta:', textoAlerta);

                // Carga los nombres de las alertas disponibles. Porque la bd esta en blanco.
                guardarTipo_notificacion(connection, alertId);

                connection.query('SELECT idTipo_Notificacion FROM tipo_notificacion WHERE nombre = ?', [alertId], (err, idTipoNotificacion) => {
                    if (err) {
                        console.error('Error al realizar la consulta:', err);
                        reject(err);
                    } else {
                        if (idTipoNotificacion.length > 0) {
                            connection.query('SELECT * FROM alertas  WHERE `descripcion` = ? and  `idTipo_notificacion` = ?', [textoAlerta , idTipoNotificacion[0].idTipo_Notificacion], (err, alertaData) => {
                                if (err) {
                                    console.error('Error al insertar tipo_notificacion:', err);
                                    reject(err);
                                } else {
                                    // no existe tiene que cargarla
                                    if (alertaData.length === 0) {
                                        connection.query('INSERT INTO alertas (`descripcion`, `vigente`, `idTipo_notificacion`) VALUES (?, 1, ? )', [textoAlerta , idTipoNotificacion[0].idTipo_Notificacion], (err, results) => {
                                            if (err) {
                                                console.error('Error al insertar tipo_notificacion:', err);
                                                reject(err);
                                            } else {
                                                console.log('Se insertó nueva  alerta:', alertId);
                                            }
                                        });
                                    }
                                    // si existe tiene que actualizarla
                                    if (alertaData.length > 0) {
                                        const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
                                        connection.query(
                                            'UPDATE `app`.`alertas` SET `fecha_creacion` = ? WHERE (`idAlerta` = ?)',
                                            [fechaActual, alertaData[0].idAlerta],
                                            (err, results) => {
                                                if (err) {
                                                    console.error('Error al actualizar fecha_creacion:', err);
                                                    reject(err);
                                                } else {
                                                    console.log('Se actualizó la fecha_creacion para la alerta con ID:', alertaData[0].idAlerta);
                                                }
                                            }
                                        );                   
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}

    
function manejarError(error) {
    console.error('Error en :', error);
    process.exit(1);
}
module.exports = notificacionesSubtes;
