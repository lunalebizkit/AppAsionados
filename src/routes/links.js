const express= require('express');
const ruta= express.Router();
const db= require('../database');

//Agregue pantalla inicio
ruta.get('/', (req, res) => {
    res.render('ingreso/inicio');
});
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

//Agregue pantalla inicio
ruta.get('/inicio', async (req, res) => {
    res.render('ingreso/inicio');
});


module.exports= ruta;