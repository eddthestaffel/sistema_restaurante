const express = require('express');
const autoController = require('../controllers/autoController');
const autoValidators = require('../validators/autoValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/', autoValidators.listQuery, validate, autoController.list);
router.get('/:id', autoValidators.idParam, validate, autoController.getById);
router.post('/', autoValidators.create, validate, autoController.create);
router.put('/:id', autoValidators.update, validate, autoController.replace);
router.patch('/:id', autoValidators.update, validate, autoController.patch);
router.delete('/:id', autoValidators.idParam, validate, autoController.remove);

module.exports = router;
