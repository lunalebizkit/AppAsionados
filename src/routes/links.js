const express= require('express');
const ruta= express.Router();
const db= require('../database');


// ruta.get('/registro', (req, res) =>{
//     res.render('paginas/registro');
// });
// ruta.post('/registro', (req, res) =>{
//     const {usuario, contrasenia, nombre, apellido, e_mail} = req.body
//     const newUsuario = {
//         usuario,
//         contrasenia,
//         nombre,
//         apellido, 
//         e_mail
//     }
//     console.log(req.body);
//     res.send('recibido');
// });


module.exports= ruta;