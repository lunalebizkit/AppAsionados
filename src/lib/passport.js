const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('./helper');

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
        contrasenia
    };
    newUsuario.contrasenia = await helpers.encriptarContrasenia(contrasenia);
    const ingresoUsuario = await db.query('INSERT INTO usuarios SET ?', [newUsuario]);
    req.flash('mensajeOk', 'Usuario Almacenado', newUsuario.nombreUsuario);
    newUsuario.id = ingresoUsuario.insertId;
    return done(null, newUsuario);
}));


/* ----------------------------
ingreso del usuario
--------------------------------*/
passport.use('local.ingreso', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasenia, done) => {
    const buscar = await db.query('Select * from usuarios where nombreUsuario = ?', [nombreUsuario]);
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

passport.serializeUser((user, done) => {
    done(null, user.id);
    });

passport.deserializeUser(async (id, done) => {
    const vuelta = await db.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]);
    done(null, vuelta[0]);
});