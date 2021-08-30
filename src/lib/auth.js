
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
        if((req.isAuthenticated()) & (req.user.rol) === '1') {
            return next();
        }return res.redirect('/ingreso');
    }
     
}