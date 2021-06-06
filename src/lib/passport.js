const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('../lib/helper');


/* ----------------------------
ingreso del usuario
--------------------------------*/
passport.use('local.ingreso', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasenia, done) => {
    const buscar = await db.query('SELECT * FROM usuarios WHERE nombreUsuario = ?', [nombreUsuario]);
    if (buscar.length > 0) {
        const usuario = buscar[0];
        const validacion = await helpers.comparaContrasenia(contrasenia, usuario.contrasenia);
        if (validacion) {
            done(null, usuario, req.flash('mensajeOk', "Bienvenido che!!"));
        } else {
            done(null, false, req.flash('mensajeMal', 'Contraseña Incorrecta'));
        }

    } else {
        return done(null, false, req.flash('mensajeMal', 'El usuario no existe'));
    }
}));    

/*------------------------------------
Registro del usuario
-------------------------------------*/
passport.use('local.registro', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasenia, done) => {
    const { nombre, apellido, email } = req.body;
    const newUsuario = {
        nombre,
        apellido,
        email,
        nombreUsuario,
        contrasenia,
    };
    newUsuario.contrasenia = await helpers.encriptarContrasenia(contrasenia);
    const ingresoUsuario = await db.query('INSERT INTO usuarios SET ?', [newUsuario]);
    req.flash('mensajeOk', 'Usuario Registrado');
    newUsuario.idUsuarios = ingresoUsuario.insertId;
    return done(null, newUsuario);
}));



passport.serializeUser((user, done) => {
    done(null, user.idUsuarios);
    });
passport.deserializeUser( async(id, done)=>{
    const fila= await db.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]);
    done(null, fila[0]);

})