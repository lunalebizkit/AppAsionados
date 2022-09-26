const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('../lib/helper');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
/* ----------------------------
ingreso del usuario
--------------------------------*/
passport.use('local.ingreso', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'contrasenia',
    passReqToCallback: true
}, async (req, nombreUsuario, contrasenia, done) => {
    const buscar = await db.query('SELECT * FROM usuarios WHERE nombreUsuario = ? and baja = false', [nombreUsuario]);
    if (buscar.length > 0) {
        const usuario = buscar[0];
        const validacion = await helpers.comparaContrasenia(contrasenia, usuario.contrasenia);
        if (validacion) {
            done(null, usuario, req.flash('mensajeOk', 'Bienvenido! ' + usuario.nombreUsuario));
        } else {
            done(null, false, req.flash('mensajeMal', 'Contraseña Incorrecta'));
            
        }

    } else {
        return done(null, false, req.flash('mensajeMal', 'Usuario en baja o no existente'));
    }
}));
passport.use( new LocalStrategy( async ( nombreUsuario, contrasenia, done)=> {
    const buscar = await db.query('SELECT * FROM usuarios WHERE nombreUsuario = ? and baja = false', [nombreUsuario]);
    if (buscar.length > 0) {
        const usuario = buscar[0];
        const validacion = await helpers.comparaContrasenia(contrasenia, usuario.contrasenia);
        if (validacion) {
            done(null, usuario);
        } else {
            done(null, false);
        }

    } else {
        return done(null, false);
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
    const buscarEmail = await db.query('SELECT * from usuarios WHERE email= ?', [email]);
    const buscarUsuario = await db.query('SELECT * from usuarios WHERE nombreUsuario= ?', [nombreUsuario]);
    if (buscarEmail.length > 0) {
         return done(null, false, req.flash('mensajeMal', 'Email Existente!'));
     }if (buscarUsuario.length > 0) {
        return done(null, false, req.flash('mensajeMal', 'Usuario Existente!'));
    }else {
        const newUsuario = {
            nombre,
            apellido,
            email,
            nombreUsuario,
            contrasenia,
            idRol: 3,
            img: 'perfil.png',
            baja: 0
        };
        const mensajeMail =`
        <h2>Hola! ${nombre}...<br>
            Bienvenido a APPasionados </h2>
        <h3>Gracias por su Registro</h3>
        <ul>
            <li>Su Usuario es:<b> ${nombreUsuario} </b></li>
            <li>Su contraseña es :<b> ${contrasenia} </b></li>
        </ul>
        <p><img src="cid: firma" > </p>
        
    `;   
    const CLIENT_ID="646859646017-mdq9mtoudeusnv9vpt4fibts5t2fnsp9.apps.googleusercontent.com";
    const CLIENT_SECRET="7JkJcecbeO2F4hAcVczI_AJk";
    const REDIRECT_URI="https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN="1//04SJ8pdBH8EWBCgYIARAAGAQSNwF-L9IrlxDmL3-qjPQ4QFwiZE92QljQkHqheNtKMiEFKfZAJ3AxnuTCqnFevAegAsjzmnKPZoo";
    
    const oAuth2cliente = new google.auth.OAuth2( 
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
        );    
     oAuth2cliente.setCredentials({refresh_token:REFRESH_TOKEN});     
     async function sendMail(){
         try{
            const accessToken= await oAuth2cliente.getAccessToken()
            const transporter= nodemailer.createTransport({
                 service: "gmail",
                 auth:{
                     type:"Oauth2",
                     user: "appasionadosdeporte@gmail.com",
                     clientId:CLIENT_ID,
                     clientSecret:CLIENT_SECRET,
                     refreshToken:REFRESH_TOKEN,
                     accessToken:accessToken
                 },
    
             });
             const mailOptions=
                
                {
                 from:"APPasionados <appasionadosdeporte@gmail.com>",
                 to: email,
                 subject:"Confirmacion de Registro",
                 html: mensajeMail, 
                 attachments: [{
                    filename: 'firma2.jpeg',
                    path: "C:/Users/Ale/Documents/Ale/AppAsionados/src/public/img/app/firma2.jpeg" ,
                    cid : 'firma'
                 }]
                 
             };
             const result = await transporter.sendMail(mailOptions);
             return result
    
    
         }catch(err){
             console.log(err);
         }
        
     } 
    sendMail()
    //  .then((result)=>res.status(200).send('enviado'))
     .catch((error)=> console.log(error.message));
        newUsuario.contrasenia = await helpers.encriptarContrasenia(contrasenia);
        const ingresoUsuario = await db.query('INSERT INTO usuarios SET ?', [newUsuario]);
        req.flash('mensajeOk', 'Usuario Registrado Correctamente');
        newUsuario.idUsuarios = ingresoUsuario.insertId;
        return done(null, newUsuario);
    }   
}));
passport.serializeUser((user, done) => {
    done(null, user.idUsuarios);
});
passport.deserializeUser(async (id, done) => {
    const fila = await db.query('SELECT * FROM usuarios WHERE idUsuarios = ?', [id]);
    done(null, fila[0]);
})