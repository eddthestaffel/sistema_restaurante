const express = require('express');
const comandaController = require('../controllers/comandaController');
const comandaValidators = require('../validators/comandaValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/', comandaValidators.listQuery, validate, comandaController.list);
router.get('/:id', comandaValidators.idParam, validate, comandaController.getById);
router.get('/:id/total', comandaValidators.idParam, validate, comandaController.total);
router.post('/', comandaValidators.abrir, validate, comandaController.abrir);
router.post('/:id/items', comandaValidators.agregarItem, validate, comandaController.agregarItem);
router.post('/:id/cerrar', comandaValidators.cerrar, validate, comandaController.cerrar);

module.exports = router;
