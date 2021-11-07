module.exports= {
    /*  funcion que asegura que la persona que acceda a la pagina esta registrada y logueado*/
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
        if((req.isAuthenticated()) && (req.user.idRol) === 1) {
            return next();
        }return res.redirect('/paginas/inicio');
    },
    duenio(req, res, next) {
        if((req.isAuthenticated()) & (req.user.idRol) === 2) {
            return next();
        }return res.redirect('/registroDuenio');
    }
     
}