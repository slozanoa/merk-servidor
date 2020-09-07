const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//crear tarea
//api/tareas
router.post('/',
  auth,
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('proyecto', 'El proyecto es obligatorio').not().isEmpty()

  ],
  tareaController.crearTarea
);
router.get('/',
  auth,
  tareaController.obtenerTarea
);
router.put('/:id',
  auth,
  tareaController.actualizarTarea
);
router.delete('/:id',
  auth,
  tareaController.eliminarTarea
);
module.exports = router;
