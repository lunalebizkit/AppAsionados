const express= require('express');
const ruta= express.Router();
const db= require('../database');


ruta.get('/registro', (req, res) =>{
    res.render('paginas/registro');
});
ruta.post('/registro', (req, res) =>{
    const {usuario, contrasenia, nombre, apellido, e_mail} = req.body
    const newUsuario = {
        usuario,
        contrasenia,
        nombre,
        apellido, 
        e_mail
    }
    console.log(req.body);
    res.send('recibido');
});
ruta.get('/ingreso', (req, res) =>  {
    res.render('paginas/ingreso');
});
ruta.post('/ingreso', async (req, res)=> {
    const {usuario, contrasenia}=req.body

    console.log(req.body);
    console.log(req.params);
    res.send('A dentro');
});

module.exports= ruta;