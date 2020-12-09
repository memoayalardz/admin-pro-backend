const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const {googleVerify} = require('../helpers/googleVerify');
const usuario = require('../models/usuario');

const login = async (req,res = response)=>{
try {
const {email,password} = req.body;

// Verificar email
const usuarioDB = await Usuario.findOne({email});
    if(!usuarioDB){
        return res.status(404).json({
            ok:false,
            msg:'Email no encontrado'
        });
    }
    const validPassword = bcryptjs.compareSync(password,usuarioDB.password);
    if(!validPassword){
        return res.status(400).json({
            ok:false,
            msg:'Contraseña no valida'
        });
    }

    // generar token

    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
        ok:true,
        msg:'Bienvenido',
        token
    })

}catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }


}

const googleSingin = async (req,res = response)=>{
    
    const googleToken = req.body.token;
    try {
    const {name,email,picture} = await googleVerify(googleToken);
    // VERIFICAR USUARIO db
    const usuarioDB = await Usuario.findOne({email});
    let usuario;
    if(!usuarioDB){
        // no existe el usuario
        usuario = new Usuario({
            nombre:name,
            email,
            password:'@@@',
            img:picture,
            google:true
        })
    }else{
        // existe usuario
        usuario = usuarioDB;
        usuario.google = true;
        usuario.password = '@@@';
    }
    // guardar DB

    await usuario.save();

 // generar token

 const token = await generarJWT(usuario.id);

    res.status(200).json({
        ok:true,
        msg:'Google Singin',
        token
    });
} catch (error) {
    console.log(error);
    res.status(401).json({
        ok:false,
        msg:'Token invalido'
    })
}

}

module.exports = {
    login,
    googleSingin
}