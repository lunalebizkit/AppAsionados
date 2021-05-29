CREATE DATABASE dataBase_deportes;
USE dataBase_deportes;

CREATE TABLE usuarios(
    id INT(11) NOT NULL,
    nombreUsuario VARCHAR(16) NOT NULL,
    contrasenia VARCHAR(60) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    e_mail VARCHAR(100) NOT NULL
);

ALTER TABLE usuarios 
    ADD PRIMARY KEY (id);

ALTER TABLE usuarios
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;  