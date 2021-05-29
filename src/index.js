const express = require ('express');
const morgan = require ('morgan');
const exphbs= require('express-handlebars');
const path= require('path');
const { urlencoded } = require('express');

// Iniciar

const aplicacion= express();


//Configuracion
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
aplicacion.use(morgan('dev'));
aplicacion.use(express.urlencoded({extended: false}));
aplicacion.use(express.json());
//Global variables
aplicacion.use((req, res, next) => {
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
