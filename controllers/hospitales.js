const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Hospital = require('../models/hospitales');
const getHospitales = async(req,res)=>{
    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre img');
    res.json({
        ok:true,
        hospitales
    })
}

const crearHospital = async(req,res)=>{
    const uid = req.uid;
    const hospital = new Hospital({
        usuario:uid,
        ...req.body}); 
    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok:true,
            hospital:hospitalDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado... revisar logs'
        })
    }
    }
const actualizarHospital = async(req,res)=>{
    res.json({
        ok:true,
        msg:'actualizarHospital'
    })
    }
const borrarHospital = async(req,res)=>{
    res.json({
        ok:true,
        msg:'borrarHospital'
    })
    }

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}