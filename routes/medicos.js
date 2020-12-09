/* 

/api/Medicos

*/
const {Router} = require('express');
const {check} = require("express-validator");
const {validarCampos} = require('../middlewares/validar-campos');
const {getMedicos,crearMedico, actualizarMedico,borrarMedico} = require('../controllers/medicos');
const { validarJWT } = require('../middlewares/validar.jwt');
const router = Router();

router.get('/',
/* validarJWT, */
getMedicos);

router.post('/', 
    [
        validarJWT,
        check('nombre','El nombre del médico es obligatoro').not().isEmpty(),
        check('hospital','El hospital id debe ser válido').isMongoId(),
        validarCampos,
    ],
    crearMedico);

    router.put('/:id', 
    [
      /*   validarJWT,
        check('nombre','El nombre es obligatoro').not().isEmpty(),
        validarCampos, */
    ],
    actualizarMedico);

    router.delete(
        '/:id', 
   /*      validarJWT, */
        borrarMedico 
        );


module.exports = router;
