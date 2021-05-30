const passport= require('passport');
const LocalStrategy=require('passport-local').Strategy;
const db= require('../database');


passport.use('local.registro', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, usuario, contrasenia, done)=>{
    const {e_mail} =req.body;
    const newUsuario = {
        usuario,
        contrasenia,
        nombre,
        apellido,
        e_mail

    }
    console.log(req.body);
}));

// passport.serializeUser((user,done)=>{}); 
passport.use('local.ingreso', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, usuario, contrasenia, done)=>{
    const {e_mail} =req.body;
    const newUsuario = {
        usuario,
        contrasenia,
        nombre,
        apellido,
        e_mail

    }
    console.log(req.body);
}));