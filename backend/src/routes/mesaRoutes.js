const express = require('express');
const mesaController = require('../controllers/mesaController');
const mesaValidators = require('../validators/mesaValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/', mesaValidators.listQuery, validate, mesaController.list);
router.get('/salon', mesaController.salon);
router.get('/:id', mesaValidators.idParam, validate, mesaController.getById);
router.post('/', mesaValidators.create, validate, mesaController.create);
router.patch('/:id', mesaValidators.update, validate, mesaController.patch);
router.delete('/:id', mesaValidators.idParam, validate, mesaController.remove);

module.exports = router;
