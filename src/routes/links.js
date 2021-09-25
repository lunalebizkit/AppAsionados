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
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios');
    const equipo= await db.query('Select * from jugador join equipos join usuarios where usuarios.IdUsuarios = jugador.idUsuarios and jugador.idEquipo = equipos.idEquipo and equipos.nombreEquipo =?', [club]);
    const pertenezco= await db.query('select * from jugador join equipos where jugador.idUsuarios =? and jugador.idEquipo = equipos.idEquipo and equipos.nombreEquipo =?', [idUsuarios, club]);
    const idEquipo= await db.query('select idEquipo from equipos where nombreEquipo =?', [club]);
    let numero= idEquipo[0].idEquipo;
    res.render('paginas/equipo', {equipos, equipo, club, pertenezco, numero, idDeportes});
});
//agregue pantalla futbol
ruta.get('/futbol', estaLogueado, async (req, res) => {
    const { idUsuarios } = req.user;
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios and deporte.idDeportes < 4');
    const misEquipos= await db.query('select equipos.nombreEquipo from jugador inner join equipos where equipos.idEquipo = jugador.idEquipo and equipos.idDeportes < 4 and jugador.idUsuarios =?', [idUsuarios]);
    const canchas = await db.query('select * from establecimiento');
    res.render('paginas/futbol', {equipos, misEquipos, canchas});
});
//agregue pantalla basquet
ruta.get('/basquet', estaLogueado, async (req, res) => {
    //const canchas = await db.query('select distinct establecimiento.idEstablecimiento, establecimiento.direccion, establecimiento.nombreEstablecimiento from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = 4');
    const { idUsuarios } = req.user;
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios and deporte.idDeportes = 4');
    const misEquipos= await db.query('select equipos.nombreEquipo from jugador inner join equipos where equipos.idEquipo = jugador.idEquipo and equipos.idDeportes = 4 and jugador.idUsuarios =?', [idUsuarios]);
    const canchas = await db.query('select * from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = 4');
    res.render('paginas/basquet', {equipos, misEquipos, canchas});
});
//agregue pantalla padel
ruta.get('/padel', estaLogueado, async (req, res) => {
    const { idUsuarios } = req.user;
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios and deporte.idDeportes = 5');
    const misEquipos= await db.query('select equipos.nombreEquipo from jugador inner join equipos where equipos.idEquipo = jugador.idEquipo and equipos.idDeportes = 5 and jugador.idUsuarios =?', [idUsuarios]);
    const canchas = await db.query('select * from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = 5');
    res.render('paginas/padel', {equipos, misEquipos, canchas});
});
//agregue pantalla deporte
ruta.get('/deporte', estaLogueado, async (req, res) => {
    res.render('paginas/deporte');
});
//pantalla crear cancha
ruta.get('/cancha/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {idEstablecimiento}=req.params;
    const establecimiento= await db.query('Select * from establecimiento where idEstablecimiento =?', [idEstablecimiento]);  
    const datosEstablecimiento= establecimiento[0];
    res.render('paginas/cancha', {datosEstablecimiento, idEstablecimiento});
});
ruta.post('/cancha/:idEstablecimiento', estaLogueado, duenio, foto, async (req, res) => {
    const {idEstablecimiento}= req.params;
    const {filename}= req.file;
    const{numeroCancha, horaInicio, horaFin, idDeportes, dia} = req.body;
    const newCancha={idEstablecimiento, numeroCancha, idDeportes};
    const cancha= await db.query('Insert into cancha set?', [newCancha]);
    const idCancha= cancha.insertId;
    const newImagen={idCancha, img: filename};
    const cargaImagen= await db.query('insert into imagenCancha set?', [newImagen]);
    async function ingresar() {
        for (let i=0; i< dia.length; i++) {
            try {
                let newDia= {idCancha, dia:dia[i]};
                let insertarDia= await db.query('Insert into dia set?', [newDia]);
        }catch(error){
            console.log(error);
        }} 
    }
    ingresar();
    const newHorario= {idCancha, horaInicio, horaFin};
     await db.query('Insert into horarios set?', [newHorario]);
     req.flash('mensajeOk', "Cancha Registrada Correctamente");
    res.redirect('/paginas/duenio');
});
ruta.get('/misCanchas/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {idEstablecimiento}=req.params;
    const establecimiento= await db.query('Select * from cancha join deporte join imagenCancha join horarios where  horarios.idCancha= cancha.id and imagenCancha.idCancha = cancha.id and cancha.idDeportes = deporte.idDeportes and cancha.idEstablecimiento =?', [idEstablecimiento]);
    console.info(establecimiento);
    res.render('paginas/misCanchas', {establecimiento});
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

//agregue pantalla crear equipo Futbol 
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
        const crearEquipo = await db.query('Insert into equipos set?', [newEquipo]);
        const idEquipo = crearEquipo.insertId;
        let newJugador = {
            idUsuarios,
            posicion,
            idEquipo
        };
        await db.query('Insert into jugador set?', [newJugador]);
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
//agregue pantalla crear equipo Basquet 
ruta.get('/crearEquipoBasquet/:id', estaLogueado, async (req, res) => {
    res.render('paginas/crearEquipoBasquet');
});
ruta.post('/crearEquipoBasquet/:id', estaLogueado, async (req, res) => {
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
        res.redirect('/paginas/crearEquipoBasquet/:id')
    }
    else {
        const crearEquipo = await db.query('Insert into equipos set?', [newEquipo]);
        const idEquipo = crearEquipo.insertId;
        let newJugador = {
            idUsuarios,
            posicion,
            idEquipo
        };
        await db.query('Insert into jugador set?', [newJugador]);
        req.flash('mensajeOk', "Equipo Creado con Exito!!!");
        res.redirect('/paginas/basquet')
    };
});
//agregue pantalla crear equipo Padel 
ruta.get('/crearEquipoPadel/:id', estaLogueado, async(req, res)=>{
    res.render('paginas/crearEquipoPadel');
});
ruta.post('/crearEquipoPadel/:id', estaLogueado, async (req, res) => {
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
        res.redirect('/paginas/crearEquipoPadel/:id')
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
        res.redirect('/paginas/padel')
    };   
});
//agregue pantalla establecimiento
ruta.get('/establecimiento', estaLogueado, duenio, async (req, res) => {
    res.render('paginas/establecimiento');
});
//agregue pantalla verCancha
ruta.get('/verCancha/:idEstablecimiento', estaLogueado, async (req, res) => {
    const{idEstablecimiento}= req.params;
    const consultaEstablecimiento= await db.query('Select * from establecimiento where idEstablecimiento =?', [idEstablecimiento]);
    const establecimiento= consultaEstablecimiento[0];
    res.render('paginas/verCancha', {establecimiento});
});
//agregue pantalla jugadores 
ruta.get('/jugadores/:jugador', estaLogueado, async(req, res)=>{
    const jugadores= await db.query('Select usuarios.idUsuarios, usuarios.nombreUsuario, usuarios.nombre, usuarios.apellido, usuarios.email from usuarios Group by usuarios.nombreUsuario');
    res.render('paginas/jugadores', {jugadores});
});
ruta.get('/reservaUsuario/:idUsuario', estaLogueado, async (req, res) => {
    const {idUsuario}= req.params;
    const reservas= await db.query("Select reserva.idReserva, cancha.id, reserva.fechaReserva, deporte.deporte, reserva.fecha, reserva.hora, cancha.numeroCancha, establecimiento.nombreEstablecimiento from reserva join establecimiento join cancha join deporte where deporte.idDeportes = cancha.idDeportes and cancha.id = reserva.idCancha and reserva.estado = 'reservado' and establecimiento.idEstablecimiento = cancha.idEstablecimiento and idUsuario =? order by reserva.fechaReserva desc", [idUsuario]);
    res.render('paginas/reservaUsuario', {reservas});
});

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
ruta.get('/carga', async (req, res) => {
    res.render('paginas/carga');
});
//REservas//
ruta.get('/reservaDeporte', estaLogueado, async(req, res)=>{
    const deporte= await db.query('select * from deporte');
    res.render('reserva/reservaDeporte', {deporte})
});
ruta.get('/reservaDeporte1/', estaLogueado, async(req, res)=>{
    var fechaActual= new Date().toLocaleDateString();
    const {deporte} =req.query;
    const canchas= await db.query('select imagenCancha.img, establecimiento.nombreEstablecimiento, cancha.numeroCancha, cancha.id, deporte.deporte, horarios.horaInicio, horarios.horaFin from establecimiento join cancha join imagenCancha join deporte join horarios where imagenCancha.idCancha = cancha.id and establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = deporte.idDeportes and cancha.id = horarios.idCancha and cancha.idDeportes =?', [deporte]);
    if((canchas.length)===0) {
        req.flash('mensajeMal', "No hay Establecimientos"),
        res.redirect('/paginas/reservaDeporte');
    }
    res.render('reserva/reservaDeporte1', {canchas, deporte, fechaActual})
});
ruta.post('/reservaDeporte1/:deporte', async(req, res)=>{
    const{fecha, idCancha}=req.body;
    const {deporte}= req.params;
    const{idUsuarios}= req.user;
    req.session.newReserva= {idUsuarios, fecha, idCancha};
    const dia= new Date(fecha).getDay() + 1;
    const dias=await db.query('Select * from dia where idCancha =? and dia=?', [idCancha, dia]);
    if ((dias.length)>0) {
        res.redirect('/paginas/reservaDeporte2/'+idCancha+'&'+"fecha="+fecha);
    }else{req.flash('mensajeMal', 'El dia seleccionado No atiende!'),
    res.redirect('/paginas/reservaDeporte1/'+ '?deporte='+deporte)}  
});
ruta.get('/reservaDeporte2/:idCancha&:fecha', async(req, res)=>{
    const { idCancha, fecha}= req.params;
     const turnos= await db.query('select * from  horarios where idCancha =?', [idCancha]);
     const reservas= await db.query('select hora from reserva where fecha =? and estado = "reservado"', [fecha]);
     const turno= turnos[0];
    res.render('reserva/reservaDeporte2', {turno, idCancha, reservas})
});
ruta.post('/reservaDeporte2/:idCancha&:fecha', async(req, res)=>{
    const {idCancha, idUsuarios, fecha}= req.session.newReserva;
    const {turno}= req.body;
    const newReserva= {idCancha, idUsuario: idUsuarios, estado: "reservado",fechaReserva: fecha, hora: turno}
    await db.query('insert into reserva set?',[newReserva]);
    req.flash('mensajeOk', 'Reserva Hecha!!!');
    res.redirect('/paginas/reservaUsuario/'+ idUsuarios);
});

module.exports = ruta