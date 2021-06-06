const express= require('express');
const ruta= express.Router();
const db= require('../database');

//Agregue pantalla equipo
ruta.get('/equipo', async (req, res) => {
    res.render('paginas/equipo');
});

//agregue pantalla futbol
ruta.get('/futbol', async (req, res) => {
    res.render('paginas/futbol');
});

//agregue pantalla deporte
ruta.get('/deporte', async (req, res) => {
    console.log(req.user);
    res.render('paginas/deporte');
});


module.exports= ruta;