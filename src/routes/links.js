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
    res.render('paginas/deporte');
});

//pantalla crear cancha
ruta.get('/cancha', async (req, res) => {
    res.render('paginas/cancha');
});
ruta.get('/vistAdmin', (req, res) =>{
    res.render('paginas/vistAdmin');
});

module.exports= ruta;