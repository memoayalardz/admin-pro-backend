/* 

/api/usuarios

*/
const {Router} = require('express');
const {check} = require("express-validator");
const {validarCampos} = require('../middlewares/validar-campos');
const {getUsuarios,crearUsuario, actualizarUsuario,borrarUsuario} = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar.jwt');
const router = Router();

router.get('/',validarJWT,getUsuarios);

router.post('/', 
    [
        /* validarJWT, */
        check('nombre','El nombre es obligatoro').not().isEmpty(),
        check('password','El password es obligatoro').not().isEmpty(),
        check('email','El email es obligatoro').isEmail(),
        validarCampos,
    ],
    crearUsuario);

    router.put('/:id', 
    [
        validarJWT,
        check('nombre','El nombre es obligatoro').not().isEmpty(),
        check('role','El rol es obligatoro').not().isEmpty(),
        check('email','El email es obligatoro').isEmail(),
        validarCampos,
    ],
    actualizarUsuario);

    router.delete(
        '/:id', 
        validarJWT, 
        borrarUsuario
        );


module.exports = router;
