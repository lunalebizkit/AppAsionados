const express = require('express');
const ruta = express.Router();



ruta.get('/', (req, res) => {
   res.render('ingreso/ingreso');
});


module.exports= ruta;