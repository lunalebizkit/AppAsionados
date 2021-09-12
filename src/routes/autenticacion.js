const express= require('express');
const ruta= express.Router();
const passport= require('passport');
const db = require('../database');
const  {estaLogueado, noEstaLogueado, admin}=require ('../lib/auth');

ruta.get('/registro', noEstaLogueado, (req, res)=> {
    res.render('ingreso/registro'); 
});
ruta.post('/registro', passport.authenticate('local.registro', {
        successRedirect: 'paginas/carga',
        failureRedirect: '/registro', 
        failureFlash: true
}));
ruta.get('/ingreso', noEstaLogueado, (req, res) =>  {
    res.render('ingreso/ingreso');
});
ruta.post('/ingreso', (req, res, next)=> {
    passport.authenticate('local.ingreso', {
        successRedirect: 'paginas/carga',
        failureRedirect: '/ingreso',
        failureFlash: true
    })(req, res, next)
});
//registro duenio//
ruta.get('/registroDuenio', estaLogueado, async(req, res)=> {
    res.render('ingreso/registroDuenio'); 
});
 ruta.post('/registroDuenio', estaLogueado, async(req, res)=>{
     const {nombreEstablecimiento, cuit, direccion}=req.body;
     const {idUsuarios}= req.user;
     const newEstablecimiento= {
         nombreEstablecimiento,
         direccion,
         cuit,
         idUsuarios
     };
     if(await db.query('insert into establecimiento set?', [newEstablecimiento])) {
         await db.query('update usuarios set idRol = "2" where idUsuarios=?', [idUsuarios]);
         res.redirect('/paginas/duenio')
     }
     else{ res.redirect('ingreso/registroDuenio')}
    
 });

//ingreso duenio//
ruta.get('/ingresoDuenio', noEstaLogueado, (req, res) =>  {
    res.render('ingreso/ingresoDuenio');
});
 ruta.post('/ingresoDuenio', (req, res, next)=>  {
     passport.authenticate('local.ingresoDuenio', {
         successRedirect: 'paginas/cancha',
         failureRedirect: '/ingresoDuenio',
         failureFlash: true
     })(req, res, next)
    });
ruta.get('/ingresoAdmin', estaLogueado, admin, (req, res) =>{
    res.render('ingreso/ingresoAdmin');
});


ruta.get('/cerrarSesion', estaLogueado, (req, res) =>{
    req.logOut();
    res.redirect('/');
});

module.exports= ruta;