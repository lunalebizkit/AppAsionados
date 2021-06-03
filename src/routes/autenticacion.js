const express= require('express');
const ruta= express.Router();
const passport= require('passport');

//Agregue pantalla inicio
ruta.get('/', (req, res) => {
    res.render('ingreso/inicio');
});

//Agregue pantalla equipo
ruta.get('/equipo', async (req, res) => {
    res.render('ingreso/equipo');
});

//agregue pantalla futbol
ruta.get('/futbol', async (req, res) => {
    res.render('ingreso/futbol');
});

//agregue pantalla deporte
ruta.get('/deporte', async (req, res) => {
    res.render('ingreso/deporte');
});

//Agregue pantalla inicio
ruta.get('/inicio', async (req, res) => {
    res.render('ingreso/inicio');
});

ruta.get('/registro', (req, res)=> {
    res.render('ingreso/registro');
});
ruta.post('/registro', passport.authenticate('local.registro', {
        successRedirect: '/profile',
        failureRedirect: '/profile', //esto es provisorio tiene que ir /registro
        failureFlash: true
}));
ruta.get('/profile', (req, res)=>{
    res.send('profile');
});
ruta.get('/ingreso', (req, res) =>  {
    res.render('ingreso/ingreso');
});
ruta.post('/ingreso', async (req, res, next)=> {
    const {usuario, contrasenia}=req.body

    console.log(req.body);
    console.log(req.params);
    res.render('ingreso/deporte');
});
// ruta.post('/registro', (req, res) =>{
//     const {usuario, contrasenia, nombre, apellido, e_mail} = req.body
//     const newUsuario = {
//         usuario,
//         contrasenia,
//         nombre,
//         apellido, 
//         e_mail
//     }
//     console.log(req.body);
//     res.send('recibido');
// });
module.exports= ruta;