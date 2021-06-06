const passport= require('passport');
const LocalStrategy=require('passport-local').Strategy;
const db= require('../database');


passport.use('local.registro', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasenia, done)=>{
    const {nombre, apellido, email} =req.body;
    const newUsuario = {
        nombre,
        apellido,
        email,
        nombreUsuario,
        contrasenia
    };
    // const ingresoUsuario = await db.query('Insert into usuarios set ?', [newUsuario]);
    newUsuario.id = ingresoUsuario.insertId;
    return done(null, newUsuario);
}));

passport.serializeUser((user,done)=>{
    done(null, user.id);
}); 
passport.deserializeUser( async (id, done)=>{
    const vuelta= await db.query('Select * from usuarios Where idUsuarios = ?', [id]);
    done(null, vuelta[0]);
});
passport.use('local.ingreso', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasenia, done)=>{
    const buscar= await db.query('Select * from usuarios where nombreUsuario = ?', [nombreUsuario]);
    if (buscar.length > 0) {
        const usuar = buscar[0];
        req.flash('mensajeOk', "Bienvenido!!");
    } else {
        return done(null, false, req.flash('mensajeMal', 'Hay un error'));
    }
}));