const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Se inicializa el server
const app = express();

//Puertos
app.set('port', process.env.PORT || 3040);

//Temas
app.set('view engine','ejs');

//Ruta de las vistas
app.set('views',path.join(__dirname,'../app/views'));

//Middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Global
dotenv.config({path: path.join(__dirname,'../env/.env')});

//Configuración de la carpeta public
app.use('/resource',express.static(path.join(__dirname,'../public/css')));


module.exports = app;