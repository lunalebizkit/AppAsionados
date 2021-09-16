const express = require('express');
const { file } = require('googleapis/build/src/apis/file');
const ruta = express.Router();
const db = require('../database');
const { estaLogueado, noEstaLogueado, admin, duenio } = require('../lib/auth');
const foto= require('../lib/foto');
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
    const canchas = await db.query('select * from establecimiento');
    res.render('paginas/futbol', {equipos, misEquipos, canchas});
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
ruta.get('/cancha/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {idEstablecimiento}=req.params;
    const establecimiento= await db.query('Select * from establecimiento where idEstablecimiento =?', [idEstablecimiento]);
    const datosEstablecimiento= establecimiento[0]
    res.render('paginas/cancha', {datosEstablecimiento, idEstablecimiento});
});
ruta.post('/cancha/:idEstablecimiento', estaLogueado, duenio, foto, async (req, res) => {
    const {idEstablecimiento}= req.params;
    const {numeroCancha, idDeportes, lunes, martes, miercoles, jueves, viernes, sabado, domingo} = req.body;
    const newCancha={idEstablecimiento, numeroCancha, idDeportes}
    const cancha= await db.query('Insert INTO cancha SET ?', [newCancha]);
    const newImagenCancha={idEstablecimiento, numeroCancha}
    //const imagenCancha= await db.query('Insert INTO imagencancha SET ?', [newImagenCancha]);
    const newDias= {'idCancha': 3, lunes, martes, miercoles, jueves, viernes, sabado, domingo};
    const dia= await db.query('Insert INTO dia SET ?', [newDias]);
    console.info(newDias);
    res.render('paginas/duenio');
});
ruta.get('/vistaAdmin', estaLogueado, admin, async (req, res) => {
    const usuarios= await db.query('select * from usuarios');
    const equipos= await db.query('select * from equipos');
    const establecimiento= await db.query('select * from establecimiento');
   
    res.render('paginas/vistaAdmin', {usuarios, equipos, establecimiento});
});
ruta.post('/vistaAdmin', admin, async (req, res) => {
    console.info(req.body);
    res.render('paginas/vistaAdmin');
});
ruta.get('/crearEquipoFutbol/:id', estaLogueado, async (req, res) => {
    res.render('paginas/crearEquipoFutbol');
});
ruta.post('/crearEquipoFutbol/:id', estaLogueado, async (req, res) => {
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
            idEquipo
        };
        await db.query('Insert into jugador set ?', [newJugador]);
        req.flash('mensajeOk', "Equipo Creado con Exito!!!");
        res.redirect('/paginas/futbol')
    };
});
ruta.get('/miEquipo/:equipo', estaLogueado, async(req, res)=>{
    const {equipo}=req.params;
    const equipos= await db.query('Select usuarios.nombreUsuario, usuarios.nombre, jugador.posicion from equipos join jugador join usuarios where jugador.idEquipo = equipos.idEquipo and usuarios.idUsuarios = jugador.idUsuarios and nombreEquipo =?',[equipo] );
    res.render('paginas/miEquipo', {equipos, equipo});
});
ruta.get('/ingresarAlEquipo/:idEquipo&:idDeportes', estaLogueado, async(req, res) =>{
    const {idEquipo, idDeportes} = req.params;
    const {posicion}=req.query;
    const {idUsuarios}= req.user;
    const newJugador={
        idUsuarios,
        posicion,
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
//agregue pantalla duenio
ruta.get('/duenio', estaLogueado, duenio, async (req, res) => {
    const {idUsuarios}= req.user;
    const canchas= await db.query('Select * from establecimiento where idUsuarios =?', [idUsuarios]);
    res.render('paginas/duenio', {canchas});
});

//agregue pantalla crear equipo Basquet TEMPORALMENTE
ruta.get('/crearEquipoBasquet/:id', estaLogueado, async (req, res) => {
    res.render('paginas/crearEquipoBasquet');
});

//agregue pantalla crear equipo Padel TEMPORALMENTE
ruta.get('/crearEquipoPadel/:id', estaLogueado, async (req, res) => {
    res.render('paginas/crearEquipoPadel');
});
//agregue pantalla establecimiento
ruta.get('/establecimiento', estaLogueado, duenio, async (req, res) => {
    res.render('paginas/establecimiento');
});
//agregue pantalla verCancha
ruta.get('/verCancha', estaLogueado, async (req, res) => {
    res.render('paginas/verCancha');
});
//agregue pantalla reserva
ruta.get('/reserva', estaLogueado, async (req, res) => {
    res.render('paginas/reserva');
});
//agregue pantalla jugadores 
ruta.get('/jugadores/:jugador', estaLogueado, async(req, res)=>{
    const jugadores= await db.query('Select usuarios.idUsuarios, usuarios.nombreUsuario, usuarios.nombre, usuarios.apellido, usuarios.email from usuarios Group by usuarios.nombreUsuario');
    res.render('paginas/jugadores', {jugadores});
});
ruta.get('/prueba', estaLogueado, async (req, res) => {
    res.render('paginas/prueba');
});
// ruta.post('/prueba/:id', estaLogueado, async (req, res) => {
   
// });
ruta.get('/miPerfil/:id', estaLogueado, async (req, res) => {
    const {id}= req.params;
    const consulta= await db.query('select * from usuarios where idUsuarios =?', [id]);
    const usuario= consulta[0];
    res.render('paginas/miPerfil', {usuario});
});
ruta.post('/miPerfil/:id', estaLogueado, foto, async (req, res) => {
    const {filename} = req.file;
    const {id}= req.params;
    if (  await db.query('update usuarios set img = ? where idUsuarios =?', [filename, id])) {
        req.flash('mensajeOk', 'Imagen Almacenada!!!');    
        res.redirect('/paginas/deporte');
    }else {
        req.flash('mensajeMal', 'Error al cargar la imagen');
        res.redirect('/paginas/deporte');
    }   
});

//agregue pantalla carga
ruta.get('/carga', estaLogueado, async (req, res) => {
    res.render('paginas/carga');
});
//REservas//
ruta.get('/reservaDeporte', async(req, res)=>{
    const deporte= await db.query('select * from deporte');
    res.render('reserva/reservaDeporte', {deporte})
});
ruta.get('/reservaDeporte1/', async(req, res)=>{
    const {deporte} =req.query;
    // console.info(req.query);
    // const canchas= await db.query('select * from canchas where idDeportes =?', [deporte]);
    res.render('reserva/reservaDeporte1')
});

module.exports = ruta