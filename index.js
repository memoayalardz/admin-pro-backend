require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./database/config');

//Crear el servidor express 
const app = express();
// mean_user
// XSy0eny3KKq1idiQ

// configurar CORS
app.use(cors());

dbConnection();


app.get('/',(req,res)=>{

    res.status(200).json({
        ok:true,
    msg:'Hola mundo'
    })

});


app.listen(process.env.PORT, ()=>
{
    console.log('Servidor corriendo' + process.env.PORT);
});
