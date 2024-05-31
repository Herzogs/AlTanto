const axios = require('axios');
const mysql = require('mysql2');

const notificacionesSubtes = require('./modulos/Subtes'); // esto es un modulo

const modulos = [notificacionesSubtes]; // Agrega los módulos para recorrerlos uno por uno



function ejecutar() {     
    // Configuración de la conexión a la base de datos MySQL
  const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'app'
    });

    
    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return;
        }

        console.log('Conectado a la base de datos MySQL');

        let modulosCompletados = 0;

        function ejecutarModulo(indice) {
           console.log("cantidad de modulos"+modulos.length);
            if (indice < modulos.length) {
                var modulo = modulos[indice];
                
                modulo(connection, (error) => {
                    if (error) {
                        console.error(`Error al cargar el módulo ${indice}:`, error);
                    } else {
                        console.log(`Módulo ${indice} cargado`);
                    }     

                    modulosCompletados++;

                    if (modulosCompletados === modulos.length) {
                        connection.end((err) => {
                            if (err) {
                                console.error('Error al cerrar la conexión a la base de datos:', err);
                            } else {
                                console.log('Conexión a la base de datos cerrada');                              
                            }
                            modulosCompletados = 0;
                        });                
                    } else {                       
                        ejecutarModulo(indice + 1);
                    }
                });
            }
        }

        // Comenzar la ejecución del primer módulo
        ejecutarModulo(0);
    });
    
}

setInterval(ejecutar, 10 * 60 * 10); // Ejecutar cada 10 minutos
