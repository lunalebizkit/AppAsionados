const express = require('express');
const { file } = require('googleapis/build/src/apis/file');
const ruta = express.Router();
const db = require('../database');
const { estaLogueado, noEstaLogueado, admin, duenio } = require('../lib/auth');
const foto= require('../lib/foto');
/*--------------------------------------------------
Pantalla de Carga
----------------------------------------------------------*/
ruta.get('/carga', async (req, res) => {
    res.render('paginas/carga');
});
/*----------------------------------------------------
 pantalla inicio
 -----------------------------------------------*/
ruta.get('/inicio', estaLogueado, async (req, res) => {
    res.render('paginas/inicio');
});
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
    const canchas = await db.query('select * from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes < 4 group by nombreEstablecimiento');
    res.render('paginas/futbol', {equipos, misEquipos, canchas});
});
//agregue pantalla basquet
ruta.get('/basquet', estaLogueado, async (req, res) => {
    //const canchas = await db.query('select distinct establecimiento.idEstablecimiento, establecimiento.direccion, establecimiento.nombreEstablecimiento from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = 4');
    const { idUsuarios } = req.user;
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios and deporte.idDeportes = 4');
    const misEquipos= await db.query('select equipos.nombreEquipo from jugador inner join equipos where equipos.idEquipo = jugador.idEquipo and equipos.idDeportes = 4 and jugador.idUsuarios =?', [idUsuarios]);
    const canchas = await db.query('select * from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = 4 group by establecimiento.nombreEstablecimiento');
    res.render('paginas/basquet', {equipos, misEquipos, canchas});
});
//agregue pantalla padel
ruta.get('/padel', estaLogueado, async (req, res) => {
    const { idUsuarios } = req.user;
    const equipos = await db.query('select * from equipos inner join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and usuarios.idUsuarios = equipos.idUsuarios and deporte.idDeportes = 5');
    const misEquipos= await db.query('select equipos.nombreEquipo from jugador inner join equipos where equipos.idEquipo = jugador.idEquipo and equipos.idDeportes = 5 and jugador.idUsuarios =?', [idUsuarios]);
    const canchas = await db.query('select * from establecimiento join cancha where establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = 5 group by nombreEstablecimiento');
    res.render('paginas/padel', {equipos, misEquipos, canchas});
});
//agregue pantalla deporte
ruta.get('/deporte', estaLogueado, async (req, res) => {
    res.render('paginas/deporte');
});
/*------------------------------------------------
Vista Admionistrador
---------------------------------------------------*/
ruta.get('/vistaAdmin', estaLogueado, admin, async (req, res) => {
    const usuarios= await db.query('select * from usuarios');
    const equipos= await db.query('select * from equipos join deporte join usuarios where equipos.idDeportes = deporte.idDeportes and equipos.idUsuarios = usuarios.idUsuarios');
    const establecimiento= await db.query('select * from establecimiento join usuarios where usuarios.idUsuarios = establecimiento.idUsuarios');
   const deporte= await db.query('Select * from deporte')
    res.render('paginas/vistaAdmin', {usuarios, equipos, establecimiento, deporte});
});
ruta.get('/alta/:id', estaLogueado, admin, async(req, res)=>{
    const {id}=req.params
    try {
        await db.query('Update usuarios set baja = 0 where idUsuarios =?', [id]);
        req.flash('mensajeOk', 'Alta de Usuario')
    } catch (error) {
        console.log(error)
        req.flash('mensajeMal', 'Alta de Usuario Fallida')
    }
    res.redirect('/paginas/vistaAdmin')
});
ruta.get('/baja/:id', estaLogueado, admin, async(req, res)=>{
    const {id}=req.params
    try {
        await db.query('Update usuarios set baja = 1 where idUsuarios =?', [id])
        req.flash('mensajeOk', 'Baja de Usuario')
    } catch (error) {
        console.log(error)
        req.flash('mensajeMal', 'Alta de Usuario Fallida')
    }
    res.redirect('/paginas/vistaAdmin')
});
ruta.get('/crearDep',estaLogueado, admin, async(req, res)=>{
    const {deporte}= req.query;
    try {
        await db.query('Insert into deporte set?', {'deporte': deporte});
        req.flash('mensajeOk', 'Deporte Creado!!!')
        res.redirect('/paginas/vistaAdmin')
    } catch (error) {
        console.info(error)
        req.flash('mensajeMal', 'No se pudo crear el Deporte')
        res.redirect('/paginas/vistaAdmin')
    }   
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
/*----------------------------------
Dueño
--------------------------------------*/
ruta.get('/duenio', estaLogueado, duenio, async (req, res) => {
    const {idUsuarios}= req.user;
    const canchas= await db.query('Select * from establecimiento where idUsuarios =?', [idUsuarios]);
    res.render('paginas/duenio', {canchas, idUsuarios});
});
ruta.get('/reservaEstablecimiento/:idEstablecimiento', estaLogueado, duenio, async(req, res)=>{
    const {idEstablecimiento}= req.params;
    const establecimiento= await db.query('Select * from reserva join cancha join establecimiento join usuarios where usuarios.idUsuarios= reserva.idUsuario and cancha.idEstablecimiento = establecimiento.idEstablecimiento and reserva.idCancha = cancha.id and establecimiento.idEstablecimiento =? and reserva.estado = "reservado" order by reserva.fechaReserva desc', [idEstablecimiento]);
    res.render('paginas/reservaEstablecimiento', {establecimiento, idEstablecimiento});
});
ruta.get('/historialReservas/:idEstablecimiento', estaLogueado, duenio, async(req, res)=>{
    const {idEstablecimiento}= req.params;
    const establecimiento= await db.query('Select * from reserva join cancha join establecimiento join usuarios where usuarios.idUsuarios= reserva.idUsuario and cancha.idEstablecimiento = establecimiento.idEstablecimiento and reserva.idCancha = cancha.id and establecimiento.idEstablecimiento =? order by reserva.fechaReserva desc', [idEstablecimiento]);
    const cantidadReservas= establecimiento.length
    const asistieron= await db.query('Select * from reserva join establecimiento join cancha where reserva.idCancha = cancha.id and cancha.idEstablecimiento = establecimiento.idEstablecimiento and reserva.estado = "Asistio" and establecimiento.idEstablecimiento =?', [idEstablecimiento]);
    const cantidadAsistieron= asistieron.length
    const fallaron =  await db.query('Select * from reserva join establecimiento join cancha where reserva.idCancha = cancha.id and cancha.idEstablecimiento = establecimiento.idEstablecimiento and reserva.estado = "No Asistio" and establecimiento.idEstablecimiento =?', [idEstablecimiento]);
    const cantidadFallaron= fallaron.length
    const cancelaron= await db.query('Select * from reserva join establecimiento join cancha where reserva.idCancha = cancha.id and cancha.idEstablecimiento = establecimiento.idEstablecimiento and reserva.estado = "cancelado" and establecimiento.idEstablecimiento =?', [idEstablecimiento]);
    const cantidadCancelaron= cancelaron.length
    const reservadas= await db.query('Select * from reserva join establecimiento join cancha where reserva.idCancha = cancha.id and cancha.idEstablecimiento = establecimiento.idEstablecimiento and reserva.estado = "reservado" and establecimiento.idEstablecimiento =?', [idEstablecimiento]);
    const cantidadReservadas= reservadas.length
    res.render('paginas/historialReservas', {establecimiento, idEstablecimiento, cantidadAsistieron, cantidadFallaron, cantidadReservas, cantidadCancelaron, cantidadReservadas});
});
ruta.get('/asistio/:idReserva&:idEstablecimiento',estaLogueado, duenio, async(req, res)=>{
    const {idReserva, idEstablecimiento}= req.params;
    try {
        await db.query('Update reserva set estado = "Asistio" where idReserva =?', [idReserva]);
        req.flash('mensajeOk', 'Turno Actulizado')
        res.redirect('/paginas/reservaEstablecimiento/' + idEstablecimiento)
    } catch (error) {
        console.info(error)
        req.flash('mensajeMal', 'No se pudo actualizar estado')
        res.redirect('/paginas/reservaEstablecimiento/' + idEstablecimiento)
    }   
});
ruta.get('/fallo/:idReserva&:idEstablecimiento',estaLogueado, duenio, async(req, res)=>{
    const {idReserva, idEstablecimiento}= req.params;
    try {
        await db.query('Update reserva set estado = "No Asistio" where idReserva =?', [idReserva]);
        req.flash('mensajeOk', 'Turno Actulizado')
        res.redirect('/paginas/reservaEstablecimiento/' + idEstablecimiento)
    } catch (error) {
        console.info(error)
        req.flash('mensajeMal', 'No se pudo actualizar estado')
        res.redirect('/paginas/reservaEstablecimiento/' + idEstablecimiento)
    }   
});
ruta.get('/cancha/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {idEstablecimiento}=req.params;
    const establecimiento= await db.query('Select * from establecimiento where idEstablecimiento =?', [idEstablecimiento]);
    const datosEstablecimiento= establecimiento[0];
    const deporte= await db.query('select * from deporte');
    res.render('paginas/cancha', {datosEstablecimiento, idEstablecimiento, deporte});
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
    res.render('paginas/misCanchas', {establecimiento});
});
ruta.get('/establecimiento/:id', estaLogueado, duenio, async (req, res) => {
    const {id}= req.params
    res.render('paginas/establecimiento', {id});
});
ruta.post('/establecimiento/:id', estaLogueado, duenio, async (req, res) => {
    const {nombreEstablecimiento, cuit, direccion}=req.body;
     const {id}= req.params;
     const newEstablecimiento= {
         nombreEstablecimiento,
         direccion,
         cuit,
         idUsuarios: id
     };
     try {
         let crearEstablecimiento= await db.query('insert into establecimiento set?', [newEstablecimiento])
         if (crearEstablecimiento){
            req.flash('mensajeOk', 'Establecimiento creado!')
            res.redirect('/paginas/duenio')
         }else{
            req.flash('mensajeMal', 'No se pudo crear el Establecimiento')
         }
     } catch (error) {
         console.log(error)
         req.flash('mensajeMal', 'No se pudo crear el Establecimiento')
         res.redirect('/paginas/duenio')
     }

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
//agregue pantalla verCancha
ruta.get('/verCancha/:idEstablecimiento', estaLogueado, async (req, res) => {
    const{idEstablecimiento}= req.params;
    
    const establecimiento= await db.query('Select * from establecimiento join cancha join deporte join imagenCancha join horarios where establecimiento.idEstablecimiento = cancha.idEstablecimiento and horarios.idCancha= cancha.id and imagenCancha.idCancha = cancha.id and cancha.idDeportes = deporte.idDeportes and cancha.idEstablecimiento =?', [idEstablecimiento]);
    const nombre = await db.query('Select nombreEstablecimiento from establecimiento where idEstablecimiento =?', [idEstablecimiento]);
    //const establecimiento= consultaEstablecimiento[0];
    //console.info(establecimiento, nombre);
    res.render('paginas/verCancha', {establecimiento, nombre});
});
//agregue pantalla jugadores 
ruta.get('/jugadores/:jugador', estaLogueado, async(req, res)=>{
    const jugadores= await db.query('Select usuarios.idUsuarios, usuarios.nombreUsuario, usuarios.nombre, usuarios.apellido, usuarios.email from usuarios Group by usuarios.nombreUsuario');
    res.render('paginas/jugadores', {jugadores});
});
ruta.get('/reservaUsuario/:idUsuario', estaLogueado, async (req, res) => {
    const {idUsuario}= req.params;
    const diaActual= new Date().toISOString().split('T')[0]
    const reservas= await db.query("Select reserva.idReserva, cancha.id, reserva.fechaReserva, deporte.deporte, reserva.fecha, reserva.hora, cancha.numeroCancha, establecimiento.nombreEstablecimiento from reserva join establecimiento join cancha join deporte where deporte.idDeportes = cancha.idDeportes and cancha.id = reserva.idCancha and reserva.estado = 'reservado' and establecimiento.idEstablecimiento = cancha.idEstablecimiento and idUsuario =? and reserva.estado = 'reservado' and reserva.fechaReserva >= ? order by reserva.fechaReserva desc", [idUsuario, diaActual]);
      res.render('paginas/reservaUsuario', {reservas});
});
ruta.get('/reservaUsuarioCancelar/:id', estaLogueado, async (req, res)=>{    
    const {id}=(req.params);
    const {idUsuarios}= req.user;
    try {
        await db.query('Update reserva set estado = "cancelado" where idReserva =?', [id]);
        req.flash('mensajeOk', 'Turno Cancelado')
        res.redirect('/paginas/reservaUsuario/'+ idUsuarios);
    } catch (error) {
        console.info(error);
        req.flash('mensajeMal', "Algo salio mal");
        res.redirect('/paginas/reservaUsuario/'+ idUsuarios);
    }    
} );
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
/*---------------------------------------------------------
 REservas
---------------------------------------------------------*/
ruta.get('/reservaDeporte', estaLogueado, async(req, res)=>{
    const deporte= await db.query('select * from deporte');
    res.render('reserva/reservaDeporte', {deporte})
});
ruta.get('/reservaDeporte1/', estaLogueado, async(req, res)=>{
    const {deporte} =req.query;
    const canchas= await db.query('select imagenCancha.img, establecimiento.nombreEstablecimiento, cancha.numeroCancha, cancha.id, deporte.deporte, horarios.horaInicio, horarios.horaFin from establecimiento join cancha join imagenCancha join deporte join horarios where imagenCancha.idCancha = cancha.id and establecimiento.idEstablecimiento = cancha.idEstablecimiento and cancha.idDeportes = deporte.idDeportes and cancha.id = horarios.idCancha and cancha.idDeportes =?', [deporte]);
    if((canchas.length)===0) {
        req.flash('mensajeMal', "No hay Establecimientos"),
        res.redirect('/paginas/reservaDeporte');
    }
    res.render('reserva/reservaDeporte1', {canchas, deporte})
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
    const { idCancha, fecha}= req.session.newReserva;
     const turnos= await db.query('select * from  horarios where idCancha =?', [idCancha]);
     const reservas= await db.query('select hora from reserva where fechaReserva =? and estado = "reservado" and idCancha =?', [fecha, idCancha]);
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

//agregue pantalla mapa
ruta.get('/mapa/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {idEstablecimiento}=req.params;
    const establecimiento= await db.query('Select * from establecimiento where idEstablecimiento =?', [idEstablecimiento]);  
    const cancha= establecimiento[0];
    console.info(establecimiento);
    res.render('paginas/mapa', {cancha, idEstablecimiento});
});

ruta.post('/mapa/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {lat} = req.body;
    //const {mapLong} = req.body;
    const {idEstablecimiento}=req.params;
    //if (  await db.query('update establecimiento set latitud = ?, longitud = ? where idEstablecimiento =?', [mapLat, mapLong, idEstablecimiento])) {
    //    req.flash('mensajeOk', 'Coordenada almacenada!!!');    
    //    res.redirect('/paginas/mapa');
    //}else {
    //    req.flash('mensajeMal', 'Error al guardar coordenada');
    //    res.redirect('/paginas/mapa');
    //}   
    //await db.query('Update establecimiento SET latitud = ? where idEstablecimiento =?', [filename, idEstablecimiento]);
    console.log(req.body);
    //res.render('paginas/mapa');
});

//agregue pantalla ver mapa usuario
ruta.get('/verMapa/:idEstablecimiento', estaLogueado, duenio, async (req, res) => {
    const {idEstablecimiento}=req.params;
    const establecimiento= await db.query('Select * from establecimiento where idEstablecimiento =?', [idEstablecimiento]);  
    const cancha= establecimiento[0];
    console.info(establecimiento);
    res.render('paginas/verMapa', {cancha, idEstablecimiento});
});

ruta.get('/tutorialJugador', estaLogueado, async (req, res) => {
    res.render('paginas/tutorialJugador');
});

ruta.get('/tutorialReserva', estaLogueado, async (req, res) => {
    res.render('paginas/tutorialReserva');
});

ruta.get('/tutorialCancha', estaLogueado, async (req, res) => {
    res.render('paginas/tutorialCancha');
});
module.exports = ruta;