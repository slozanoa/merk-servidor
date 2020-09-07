const Usuario = require('../models/Usuario');
const bcryptjs=require('bcryptjs');
const { validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) =>{
    //revisamos si hay errores
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()});
    }
    //extraer email y password
    const {email, password} = req.body;
    try{
        //revisar si el email es correcto
        let usuario  = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }
        //verificar la contraseña
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg:'El usuario no existe'});
        }
        //crear json web token
        const payload = {
            usuario:{
                id: usuario.id
            }
        };
        //firmar el token
        jwt.sign(payload, process.env.SECRETA,{
            expiresIn:3600

        }, (error,token)=>{
            if(error) throw error;
            //mensaje de confirmacion
            res.json({token})
        })
    }catch(error){
        console.log(error);
    }
}


//usuario usuarioAutenticado
exports.usuarioAutenticado = async (req,res)=>{
  try {
      const usuario = await Usuario.findById(req.usuario.id).select('-password')
      res.json( {usuario})
  } catch (e) {
    console.log(e)
    res.status(500).json({msg: 'Hubo un error'})
  }
}
