const express = require('express');
const marcaController = require('../controllers/marcaController');
const autoController = require('../controllers/autoController');
const marcaValidators = require('../validators/marcaValidators');
const autoValidators = require('../validators/autoValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/', marcaController.list);
router.get('/:id', marcaValidators.idParam, validate, marcaController.getById);
router.post('/', marcaValidators.create, validate, marcaController.create);
router.put('/:id', marcaValidators.update, validate, marcaController.replace);
router.patch('/:id', marcaValidators.update, validate, marcaController.patch);
router.delete('/:id', marcaValidators.idParam, validate, marcaController.remove);

router.get(
  '/:marcaId/autos',
  marcaValidators.marcaIdParam,
  autoValidators.listQuery,
  validate,
  autoController.listByMarca
);
router.post(
  '/:marcaId/autos',
  marcaValidators.marcaIdParam,
  autoValidators.create,
  validate,
  autoController.create
);

module.exports = router;
