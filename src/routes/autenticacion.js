const express= require('express');
const ruta= express.Router();
const passport= require('passport');


ruta.get('/registro', (req, res)=> {
    res.render('ingreso/registro');
});
ruta.post('/registro', passport.authenticate('local.registro', {
        successRedirect: '/profile',
        failureRedirect: '/registro',
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
    res.send('A dentro');
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