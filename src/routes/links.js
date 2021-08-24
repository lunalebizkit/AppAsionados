const express = require('express');
const ruta = express.Router();
const db = require('../database');
const { estaLogueado, noEstaLogueado, admin } = require('../lib/auth');

//Agregue pantalla equipo
ruta.get('/equipo', estaLogueado, async (req, res) => {
    res.render('paginas/equipo');
});

//agregue pantalla futbol
ruta.get('/futbol/:id', estaLogueado, async (req, res) => {
    const {id}= req.params;
    const equipos= await db.query('select * from equipos inner join deporte where equipos.idDeportes = deporte.idDeportes');
    const miEquipo= await db.query('select * from equipos where idUsuarios =?', [id]);
    console.info(miEquipo);
    res.render('paginas/futbol', {equipos, miEquipo});
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
ruta.get('/vistaAdmin', estaLogueado, async (req, res) => {
    const cookie = req.session.cookie;
    console.info(req.user);
    console.info(cookie);
    res.render('paginas/vistaAdmin');
});
ruta.post('/vistaAdmin', estaLogueado, async (req, res) => {
    console.info(req.body);
    res.render('paginas/vistaAdmin');
});
ruta.get('/crearEquipoFutbol/:id', async (req, res) => {
    res.render('paginas/crearEquipoFutbol');
});
ruta.post('/crearEquipoFutbol/:id', async (req, res) => {
    const { id } = req.params;
    const idUsuarios = id
    const { nombreEquipo, posicion, idDeportes } = req.body;
    let newEquipo = {
        nombreEquipo,
        idDeportes,
        idUsuarios
    };
    const consulta= await db.query('Select * from equipos Where nombreEquipo =?', [nombreEquipo]);
    if((consulta.length)>0) {
        req.flash('mensajeMal', "Equipo Existente");
        res.redirect('/paginas/crearEquipoFutbol/:id')
    }
    else {const crearEquipo = await db.query('Insert into equipos set ?', [newEquipo]);
            const idEquipo = crearEquipo.insertId;
            let newJugador= {
            idUsuarios,
            posicion,
            idDeportes,
            idEquipo
            };
            await db.query('Insert into jugador set ?', [newJugador]);
            req.flash('mensajeOk', "Equipo Creado con Exito!!!");
            res.redirect('/paginas/futbol')};    
});

module.exports = ruta;