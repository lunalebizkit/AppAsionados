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
ruta.post('/ingreso', async (req, res, next)=> {
    passport.authenticate('local.ingreso', {
        successRedirect: '/inicio',
        failureRedirect: '/ingreso',
        failureFlash: true
    })(req, res, next);
});

module.exports= ruta;