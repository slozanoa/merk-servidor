//exportamos el modelo de usuario
const Usuario = require('../models/Usuario');
const bcryptjs=require('bcryptjs');
const { validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
exports.crearUsuario= async(req,res)=>{
    //revisamos si hay errores 
    const errors  = validationResult(req); 
    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()});
    }
    //extraer email y password
    const {email, password}= req.body;
    try{
        //revisar que el usuario registrado se unico
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'})
        }
        //crear usuatio
        usuario = new Usuario(req.body);
        //crear el salt
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password,salt);
        await usuario.save();
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
        res.status(400).send('Hubo un error');
    }
    
}