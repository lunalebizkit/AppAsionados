const express= require('express');
const ruta= express.Router();
const passport= require('passport');


ruta.get('/registro', (req, res)=> {
    res.render('ingreso/registro'); 
});
ruta.post('/registro', passport.authenticate('local.registro', {
        successRedirect: 'paginas/deporte',
        failureRedirect: '/registro', 
        failureFlash: true
}));

ruta.get('/ingreso', (req, res) =>  {
    res.render('ingreso/ingreso');
});
ruta.post('/ingreso', (req, res, next)=> {
    passport.authenticate('local.ingreso', {
        successRedirect: 'paginas/deporte',
        failureRedirect: '/ingreso',
        failureFlash: true
    })(req, res, next)
});

//registro duenio//
ruta.get('/registroDuenio', (req, res)=> {
    res.render('ingreso/registroDuenio'); 
});
// ruta.post('/registroDuenio', /*passport.authenticate('local.registroDuenio', {
//         successRedirect: 'paginas/cancha',
//         failureRedirect: '/registroDuenio', 
//         failureFlash: true 
// })*/);

//ingreso duenio//
ruta.get('/ingresoDuenio', (req, res) =>  {
    res.render('ingreso/ingresoDuenio');
});
// ruta.post('/ingresoDuenio', (req, res, next)=> /* {
//     passport.authenticate('local.ingresoDuenio', {
//         successRedirect: 'paginas/cancha',
//         failureRedirect: '/ingresoDuenio',
//         failureFlash: true
//     })*/(req, res, next)
// );
ruta.get('/ingresoAdmin', (req, res) =>{
    res.render('ingreso/ingresoAdmin');
});


ruta.get('/cerrarSesion', (req, res) =>{
    req.logOut();
    res.redirect('/');
});

module.exports= ruta;