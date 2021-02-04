const {Router} = require('express');
const {check} = require("express-validator");
const {validarCampos} = require('../middlewares/validar-campos');
const {fileUpload,returnImage} = require('../controllers/uploads');
const expresFileUpload = require('express-fileupload');
const { validarJWT } = require('../middlewares/validar.jwt');
const router = Router();

router.use(expresFileUpload());

router.put('/:tipo/:id',
    validarJWT, 
    fileUpload
);
router.get('/:tipo/:foto',
 /*    validarJWT,  */
    returnImage
);

module.exports = router;