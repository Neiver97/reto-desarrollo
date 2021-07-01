const app = require('../src/config/server');


require('./app/routes/routes')(app);

//Ponemos a escuchar el server
app.listen(app.get('port'),()=>{
    console.log(`El servidor está escuchando en el puerto ${app.get('port')}`);
});