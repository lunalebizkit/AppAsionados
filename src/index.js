const express = require ('express');
const morgan = require ('morgan');
const exphbs= require('express-handlebars');
const path= require('path');
const session= require('express-session');
const passport= require('passport'); 
const MySQLStore = require('express-mysql-session');
const { dataBase } = require('./keys');
const flash= require('connect-flash');
const multer= require('multer');
const {v4: uuidv4}= require('uuid');


/* Iniciar
------------------------------------------------------------------------------
*/
const aplicacion= express();
require('./lib/passport');


/*Configuracion
----------------------------------------------------------------------
*/
const storage= multer.diskStorage({
    destination: path.join(__dirname, 'public/img/descarga/'),
    filename: (req, file, cb) =>{
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase())
    }
});
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
aplicacion.use(multer({
    storage,
    dest: path.join(__dirname, 'public/img/descarga/'),
    fileFilter: (req, file, cb) => {
        const admitido= /jpg|jpeg|gif|png|/;
        const tipo= admitido.test(file.mimetype);
        const extension= admitido.test(path.extname(file.originalname));
        if (tipo && extension) {
            return cb(null, true)
        }
        cb(null, req.flash('mensajeMal', "Debe seleccionar imagenes"))
    }
}).single('imagen'));

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
