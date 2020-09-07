const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const app = express();

//conectarme a la base de datos
conectarDB();
//habilitar cors
 app.use(cors());
//habilitar express json
app.use(express.json({extended:true}));
//puerto de app
const port = process.env.port || 4000;
//importar rutas
app.use('/api/usuario', require('./router/usuarios'));
app.use('/api/auth', require('./router/auth'));
app.use('/api/proyectos', require('./router/proyectos'));
app.use('/api/tareas', require('./router/tareas'));


//arrancar la app
app.listen(port, '0.0.0.0' ()=>{
    console.log(`El servidor está funvionando por el puerto ${port}`)
})
