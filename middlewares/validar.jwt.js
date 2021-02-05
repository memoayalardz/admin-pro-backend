const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');



const validarJWT = (req,res = response,next) => {
    const token = req.header('x-token');
    
if(!token){
    return res.status(401).json({
        ok:false,
        msg:'No hay token en la petición'
    })
}
try {
    const {uid}  = jwt.verify(token, process.env.JWT_SECRET);
 
    if(!uid){
        return res.status(500).json({
            ok:false,
            msg:'No se pudo generar el uid'
        })
    }
    req.uid = uid;
    next();

} catch (error) {
    return res.status(401).json({
        ok:false,
        msg:'Token no válido'
    })
}
    

}

const validarADMIN_ROLE = async(req,res = response,next)=>{
    const uid = req.uid;
try {
    
  const usuarioDB =  await Usuario.findById(uid);
 
if(!usuarioDB){
    res.status(404).json({
        ok:false,
        msg:'No existe el usuario'
    })
}

if(usuarioDB.role !== 'ADMIN_ROLE'){
    res.status(403).json({
        ok:false,
        msg:'No tiene privilegios para realizar esa acción'
    })
}
next();


} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:'Hable con el administrador',
    })
}
}
const validarADMIN_ROLE_oUser = async(req,res = response,next)=>{
    const uid = req.uid;
    const id = req.params.id;
try {
    
  const usuarioDB =  await Usuario.findById(uid);
 
if(!usuarioDB){
    res.status(404).json({
        ok:false,
        msg:'No existe el usuario'
    })
}

if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
    next();
    
}else{
    res.status(403).json({
        ok:false,
            msg:'No tiene privilegios para realizar esa acción'
        })
}


} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:'Hable con el administrador',
    })
}
}
module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_oUser
}