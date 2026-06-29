const express = require('express');
const menuController = require('../controllers/menuController');
const menuValidators = require('../validators/menuValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/', menuValidators.listQuery, validate, menuController.list);
router.get('/:id', menuValidators.idParam, validate, menuController.getById);
router.post('/', menuValidators.create, validate, menuController.create);
router.patch('/:id', menuValidators.update, validate, menuController.patch);
router.delete('/:id', menuValidators.idParam, validate, menuController.remove);

module.exports = router;
