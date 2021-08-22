const express= require('express');
const ruta= express.Router();
const db= require('../database');
const {estaLogueado, noEstaLogueado, admin}=require('../lib/auth');

//Agregue pantalla equipo
ruta.get('/equipo', estaLogueado, async (req, res) => {
    res.render('paginas/equipo');
});

//agregue pantalla futbol
ruta.get('/futbol', estaLogueado, async (req, res) => {
    res.render('paginas/futbol');
});

//agregue pantalla basquet
ruta.get('/basquet', estaLogueado, async (req, res) => {
    res.render('paginas/basquet');
});

//agregue pantalla padel
ruta.get('/padel', estaLogueado, admin, async (req, res) => {
    res.render('paginas/padel');
});

//agregue pantalla deporte
ruta.get('/deporte', estaLogueado, async (req, res) => {
    res.render('paginas/deporte');
});

//pantalla crear cancha
ruta.get('/cancha', estaLogueado, async (req, res) => {
    res.render('paginas/cancha');
});
ruta.get('/vistaAdmin', estaLogueado, async(req, res) =>{
    const cookie= req.session.cookie;
    console.info(req.user);
    console.info(cookie);
    res.render('paginas/vistaAdmin');
});
ruta.post('/vistaAdmin', estaLogueado, async(req, res) =>{
    console.info(req.body);
    res.render('paginas/vistaAdmin');
});
ruta.get('/crearEquipoFutbol', async (req, res) =>{
    res.render('paginas/crearEquipoFutbol');
});
ruta.post('/crearEquipoFutbol', async(req, res )=>{
    console.info(req.body);
    res.render('paginas/crearEquipoFutbol');
});

module.exports= ruta;