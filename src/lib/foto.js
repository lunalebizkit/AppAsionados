const path= require('path');
const multer= require('multer');
const {v4: uuidv4}= require('uuid');
const storage= multer.diskStorage({
    destination: path.join(__dirname, '../public/img/descarga/'),
    filename: (req, file, cb) =>{
        cb(null, uuidv4() + path.extname(file.originalname).toLocaleLowerCase())
    }
});
const foto=multer({
    storage,
    dest: path.join(__dirname, '../public/img/descarga/'),
    fileFilter: (req, file, cb) => {
        const admitido= /jpg|jpeg|gif|png|/;
        const tipo= admitido.test(file.mimetype);
        const extension= admitido.test(path.extname(file.originalname));
        if (tipo && extension) {
            return cb(null, true)
        }
        cb(null, req.flash('mensajeMal', "Debe seleccionar imagenes"))
    }
}).single('imagen');
module.exports= foto;