const {response} = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const {updateImage} = require('../helpers/updateImage');
const fileUpload = (req,res = response) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales','medicos','usuarios']
// Validar carpeta
    if(!tiposValidos.includes(tipo)){
        res.status(400).json({
            ok:true,
            msg:'No se encontro el destino'
        })
    }
    // Validar archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
        ok:false,
            msg:'No hay ningún archivo.'
        });
      }
    //  Subir archivo
    const file = req.files.imagen;

    // extraer extension
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length-1];

    // validar extensión
    const extencionesValidas = ['png','jpg','jpeg','gif','webp'];
    if(!extencionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
                ok:false,
                msg:'No es una extensión permitida..'
        });
    }

    // nombre archivo

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // path para guardar la imagen

    const path = `./uploads/${tipo}/${nombreArchivo}`;
    // mover la imagen
    file.mv(path, (err) =>{
        if(err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen.'
        });
        }
        // Actualizar base de datos
        if( updateImage(tipo,id,nombreArchivo)){

            res.status(200).json({
                ok:true,
                msg:'Archvio subido',
                nombreArchivo
            })
        }
    });

  
}


const returnImage = (req,res = response) => {
    const {tipo, foto} = req.params;
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    // imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }



}
module.exports = {
    fileUpload,
    returnImage
}