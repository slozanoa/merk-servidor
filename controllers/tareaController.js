const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult}= require('express-validator');

//crear una nueva tareas
exports.crearTarea = async (req,res)=>{
  //Revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
      return res.status(400).json({errores:errores.array()});
  }

  try {
    const {proyecto} = req.body;
    //revisar si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
      return res.status(404).json({msg: 'Proyecto no encontrado'})
    }
    //revisar si el proyecto pertenece al usuario identificado
    //Verificar el creador del proyecto
    if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No Autorizado'});
    }
    //crear la tareas
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({tarea});

  } catch (e) {
    console.log(e);
    res.status(500).send('Hubo un error')
  }
}

//obtener tareas por proyectosController
exports.obtenerTarea = async (req,res) =>{
  //extraemos el proyecto
  try {
    const {proyecto} = req.body;
    //revisar si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
      return res.status(404).json({msg: 'Proyecto no encontrado'})
    }
    //revisar si el proyecto pertenece al usuario identificado
    //Verificar el creador del proyecto
    if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No Autorizado'});
    }
    //obtener la tarea
    const tareas = await Tarea.find({proyecto});
    res.json({tareas});

  } catch (e) {
    console.log(e);
    res.status(500).send('Hubo un error')
  }
}
//actualizar tarea
exports.actualizarTarea = async (req,res) =>{
  try {
    //extraemos el datos del body
    const {proyecto,nombre,estado} = req.body;
    //revisar si existe la tareas
    let tarea = await Tarea.findById(req.params.id);
    if(!tarea){
      return res.status(404).json({msg:'No existe esa tarea'})
    }
    //revisar si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);
    //revisar si el proyecto pertenece al usuario identificado
    //Verificar el creador del proyecto
    if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No Autorizado'});
    }
    //crear objeto con la nueva información
    const nuevaTarea = {};
    if(nombre) nuevaTarea.nombre = nombre;
    if(estado) nuevaTarea.estado = estado;
    //actualizo la tarea
     tarea = await Tarea.findByIdAndUpdate({_id:req.params.id}, nuevaTarea, {new:true});
     res.json({tarea});

  } catch (e) {
    console.log(e);
    res.status(500).send('Hubo un error')
  }
}
exports.eliminarTarea = async (req,res) =>{
  try {
    //extraemos el datos del body
    const {proyecto} = req.body;
    //revisar si existe la tareas
    let tarea = await Tarea.findById(req.params.id);
    if(!tarea){
      return res.status(404).json({msg:'No existe esa tarea'})
    }
    //revisar si el proyecto existe
    const existeProyecto = await Proyecto.findById(proyecto);
    //revisar si el proyecto pertenece al usuario identificado
    //Verificar el creador del proyecto
    if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No Autorizado'});
    }
  //Eliminar tareas
  await Tarea.findOneAndRemove({_id: req.params.id});
  res.json({msg:'Traea eliminada'});

  } catch (e) {
    console.log(e);
    res.status(500).send('Hubo un error')
  }
}
