const bcrypt= require('bcryptjs');
const helpers= {};



helpers.encriptarContrasenia = async (contrasenia) => {
    const genera= await  bcrypt.genSalt(5);
    const compara=  await bcrypt.hash(contrasenia, genera);
    return compara;

};

helpers.comparaContrasenia = async (contrasenia, contraseniaGuardada) => {
    try {
        return  await bcrypt.compare(contrasenia, contraseniaGuardada);
       
    } catch (error) {
    console.log(error);
    }
};
 module.exports= helpers;