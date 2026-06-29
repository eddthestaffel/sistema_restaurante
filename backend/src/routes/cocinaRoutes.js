const express = require('express');
const cocinaController = require('../controllers/cocinaController');
const cocinaValidators = require('../validators/cocinaValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/', cocinaValidators.listQuery, validate, cocinaController.list);
router.patch('/items/:itemId', cocinaValidators.cambiarEstado, validate, cocinaController.cambiarEstado);

module.exports = router;
