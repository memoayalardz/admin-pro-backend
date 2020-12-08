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

// Lectura y parse del body

app.use( express.json() );

dbConnection();



app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));


app.listen(process.env.PORT, ()=>
{
    console.log('Servidor corriendo' + process.env.PORT);
});
