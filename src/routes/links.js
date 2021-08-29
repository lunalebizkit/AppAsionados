const express = require('express');
const ruta = express.Router();
const db = require('../database');
const { estaLogueado, noEstaLogueado, admin } = require('../lib/auth');

//Agregue pantalla equipo
ruta.get('/equipo/:club&:idDeportes', estaLogueado, async (req, res) => {
    const {club}= req.params;
    const {idDeportes}= req.params;
    const {idUsuarios} = req.user;
    const equipo= await db.query('Select * from jugador join equipos join usuarios where usuarios.IdUsuarios = jugador.idUsuarios and jugador.idEquipo = equipos.idEquipo and equipos.nombreEquipo =?', [club]);
    const pertenezco= await db.query('select * from jugador join equipos where jugador.idUsuarios =? and jugador.idEquipo = equipos.idEquipo and equipos.nombreEquipo =?', [idUsuarios, club]);
   const idEquipo= await db.query('select idEquipo from equipos where nombreEquipo =?', [club]);
   let numero= idEquipo[0].idEquipo;
    res.render('paginas/equipo', {equipo, club, pertenezco, numero, idDeportes});
});
//agregue pantalla futbol
ruta.get('/futbol', estaLogueado, async (req, res) => {
    const { idUsuarios } = req.user;
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios');
    const misEquipos= await db.query('select equipos.nombreEquipo from jugador inner join equipos where equipos.idEquipo = jugador.idEquipo and jugador.idUsuarios =?', [idUsuarios]);
    res.render('paginas/futbol', {equipos, misEquipos});
});
//agregue pantalla basquet
ruta.get('/basquet', estaLogueado, async (req, res) => {
    res.render('paginas/basquet');
});
//agregue pantalla padel
ruta.get('/padel', estaLogueado, async (req, res) => {
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
ruta.get('/vistaAdmin', estaLogueado, admin, async (req, res) => {
    const cookie = req.session.cookie;
    console.info(cookie);
    res.render('paginas/vistaAdmin');
});
ruta.post('/vistaAdmin', admin, async (req, res) => {
    console.info(req.body);
    res.render('paginas/vistaAdmin');
});
ruta.get('/crearEquipoFutbol/:id', estaLogueado, async (req, res) => {
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
    const consulta = await db.query('Select * from equipos Where nombreEquipo =?', [nombreEquipo]);
    if ((consulta.length) > 0) {
        req.flash('mensajeMal', "Equipo Existente");
        res.redirect('/paginas/crearEquipoFutbol/:id')
    }
    else {
        const crearEquipo = await db.query('Insert into equipos set ?', [newEquipo]);
        const idEquipo = crearEquipo.insertId;
        let newJugador = {
            idUsuarios,
            posicion,
            idDeportes,
            idEquipo
        };
        await db.query('Insert into jugador set ?', [newJugador]);
        req.flash('mensajeOk', "Equipo Creado con Exito!!!");
        res.redirect('/paginas/futbol')
    };
});
ruta.get('/miEquipo/:equipo', async(req, res)=>{
    const {equipo}=req.params;
    const equipos= await db.query('Select usuarios.nombreUsuario, usuarios.nombre, jugador.posicion from equipos join jugador join usuarios where jugador.idEquipo = equipos.idEquipo and usuarios.idUsuarios = jugador.idUsuarios and nombreEquipo =?',[equipo] );
    res.render('paginas/miEquipo', {equipos, equipo});
});
ruta.get('/ingresarAlEquipo/:idEquipo&:idDeportes', async(req, res) =>{
    const {idEquipo, idDeportes} = req.params;
    const {posicion}=req.query;
    const {idUsuarios}= req.user;
    const newJugador={
        idUsuarios,
        posicion,
        idDeportes,
        idEquipo
    }
    if (await db.query('insert into jugador set?', [newJugador])){
        req.flash('mensajeOk', 'Ya sos parte del equipo!!!');
        res.redirect('/paginas/futbol');
    }else{
        res.render('paginas/ingresarAlEquipo');
    }
});

//agregue pantalla inicio
ruta.get('/inicio', estaLogueado, async (req, res) => {
    res.render('paginas/inicio');
});

module.exports = ruta