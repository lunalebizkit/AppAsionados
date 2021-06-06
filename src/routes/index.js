const express = require('express');
const ruta = express.Router();


ruta.get('/', (req, res) => {
   res.render('paginas/inicio');
});


module.exports= ruta;