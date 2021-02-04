const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req,res)=>{
    const desde = Number(req.query.desde || 0);
    /*
    Creamos una colleción de promesas 
        *para optimizarlas a diferencia de hacerlas individuales "await" *
    Hacemos desestructuracion para asignar el valor a una variable de cada promesa (en este caso son 2)
    - se ejecutan de manera simultanea -
    */
   const[usuarios, total] = await Promise.all([
        Usuario.find({},'nombre email role google img')
        .skip(desde)
        .limit(5),

        Usuario.countDocuments()
    ]);
    /* Fin colección promesas */
    res.status(200).json({
        ok:true,
        usuarios,
        total
    })

}


const crearUsuario = async(req,res)=>{
    const {email, password, nombre} = req.body;


    try{

        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya existe!'
            })

        }

        const usuario = new Usuario (req.body);

        // Encriptar psw

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password,salt);

        // Guardar usuario
        await usuario.save();
            // generar token

    const token = await generarJWT(usuario.id);


        res.status(200).json({
            ok:true,
            usuario,
        token   })



    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... revisar logs'
        })
    }

  

}

const actualizarUsuario = async(req,res = response) => {
    const uid = req.params.id;

    
    try{
        const usuarioDB =  await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            })
        }

        
        // actualizar
        const {password,google,email,...campos} = req.body;
        if(usuarioDB.email !== email)
        {
            const existeEmail = await Usuario.findOne({email: email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe un usuario con ese email'

                });
            }
        }        
        if(!usuarioDB.google){
            campos.email = email;
        }else if(usuarioDB.email !== email){
            return res.status(400).json({
                ok:false,
                msg:'Usuario de Google, no puede cambiar su correo'

            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});



        res.json({
            ok:true,
            usuario:usuarioActualizado
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }

}

const borrarUsuario = async(req,res = response) => {
    const uid = req.params.id;
    try{
        const usuarioDB =  await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            })
        }

        await Usuario.findOneAndDelete(uid);

        res.json({
            ok:true,
            msg:'Usuario eliminado'})

    } catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }

}
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario

}