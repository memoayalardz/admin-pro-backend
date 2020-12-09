const {response} = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospitales');
const getTodo = async(req,res) => {
    const buscar = req.params.busqueda;
    const regex = new RegExp(buscar, 'i');

    const [usuarios,medicos,hospitales] = await Promise.all([
        Usuario.find({nombre:regex}),
        Medico.find({nombre:regex}),
        Hospital.find({nombre:regex})
    ]);
/*     const usuarios = await Usuario.find({nombre:regex});
    const medicos = await Medico.find({nombre:regex});
    const hospitales = await Hospital.find({nombre:regex}); */

    
    res.status(200).json({
        ok:true,
        usuarios,
        medicos,
        hospitales
    })
}
const getDocumentosColeccion = async(req,res) => {
    const tabla = req.params.tabla;
    const buscar = req.params.busqueda;
    const regex = new RegExp(buscar, 'i');
    let data = [];

    switch(tabla){
        case 'medicos':
             data = await Medico.find({nombre:regex})
                                    .populate('usuario','nombre img')
                                    .populate('hospital','nombre img');
      
        break;
        case 'hospitales':
             data = await Hospital.find({nombre:regex})
                                        .populate('usuario','nombre img');
       
        break;
        case 'usuarios':
             data = await Usuario.find({nombre:regex});
           
        break;
        default:
            res.status(400).json({
                ok:false,
                msg:'No existe esa colección'
            })
        break;

    }
            res.status(200).json({
                ok:true,
                resultados:data,
            })
}

module.exports = {

getTodo ,
getDocumentosColeccion
}