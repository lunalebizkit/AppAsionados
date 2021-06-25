

module.exports= {
    estaLogueado(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } return res.redirect('/ingreso');
    },
    noEstaLogueado(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        } return res.redirect('/paginas/deporte');
    },
    admin(req, res, next) {
        if((req.user.rol) === 'admin') {
            return next();
        } return req.flash('mensajeMal', 'Acceso restringido'),
        res.redirect('/ingreso');
    }
     
}