const express = require('express');
const { estaLogueado, noEstaLogueado, admin, duenio } = require('../lib/auth');
const ruta = express.Router();
ruta.get('/', noEstaLogueado, async(req, res) => {
   res.render('ingreso/ingreso');
});
module.exports= ruta;