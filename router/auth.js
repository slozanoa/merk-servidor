//rutas para autenticar
const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
//crear usuarios
// api/usuarios

router.post('/',
    [
        check('email', 'agregar el email valido').isEmail(),
        check('password', 'El password debe de ser minimo 6 caracteres').isLength({min:6})
    ],
    authController.autenticarUsuario);
router.get('/',
  auth,
  authController.usuarioAutenticado
)
module.exports = router;
