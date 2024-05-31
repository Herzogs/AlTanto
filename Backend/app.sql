DROP DATABASE IF EXISTS app;
CREATE DATABASE app;
use app;

CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'usuario') NOT NULL
);

CREATE TABLE tipo_notificacion (
    idTipo_Notificacion INT AUTO_INCREMENT PRIMARY KEY,
   nombre varchar(50) ,
	grupo varchar(50) 
);

CREATE TABLE IF NOT EXISTS alertas (
    idAlerta INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255),
    vigente boolean,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idTipo_notificacion INT,
    FOREIGN KEY (idTipo_notificacion) REFERENCES tipo_notificacion(idTipo_Notificacion)
);

