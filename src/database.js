const mysql= require('mysql');
const {promisify}=require('util');
const {dataBase}=require('./keys');

const db= mysql.createPool(dataBase);

db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Base de Datos cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de Datos tiene muchas conexiones');
        }
        if (err.code === 'ECONREFUSED') {
            console.error('La conexion fue rechazada');
        }
    }
    if (connection) connection.release();
    console.log('Base de datos conectada');
    return;

    }
);
 module.exports= db;
db.query= promisify(db.query)