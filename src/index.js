const express = require ('express');
const morgan = require ('morgan');
const exphbs= require('express-handlebars');
const path= require('path');
const session= require('express-session');
const passport= require('passport'); 
const MySQLStore = require('express-mysql-session');
const { dataBase } = require('./keys');
const flash= require('connect-flash');
const cors= require('cors');

/* Iniciar
------------------------------------------------------------------------------
*/
const aplicacion= express();
require('./lib/passport');


/*Configuracion
----------------------------------------------------------------------
*/

aplicacion.set('port', process.env.PORT || 8000);
aplicacion.set('views', path.join(__dirname, 'views'));
aplicacion.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(aplicacion.get('views'), 'layouts'),
    partialsDir: path.join(aplicacion.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
aplicacion.set('view engine', '.hbs');

//middeleware
aplicacion.use(flash());
aplicacion.use(cors());
aplicacion.use(session({
    secret: 'aleLuna',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(dataBase)
}));
aplicacion.use(morgan('dev'));
aplicacion.use(express.urlencoded({extended: true}));
aplicacion.use(express.json());

//Global variables
aplicacion.use(passport.initialize());
aplicacion.use(passport.session());
aplicacion.use((req, res, next) => {
    aplicacion.locals.mensajeOk=req.flash('mensajeOk');
    aplicacion.locals.mensajeMal=req.flash('mensajeMal');
    aplicacion.locals.user = req.user;
    next();
});

//Routes
aplicacion.use(require('./routes'));
aplicacion.use(require('./routes/autenticacion'));
aplicacion.use('/paginas', require('./routes/links'));


//Archivo Publicos
aplicacion.use(express.static(path.join(__dirname, 'public')));
//Starting the server
aplicacion.listen(aplicacion.get('port'), () => {
    console.log('La Aplicacion esta conectada a ', aplicacion.get('port'));
});
