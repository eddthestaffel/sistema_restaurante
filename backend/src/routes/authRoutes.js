const express = require('express');
const authController = require('../controllers/authController');
const authValidators = require('../validators/authValidators');
const validate = require('../middlewares/validate');
const { verifyAccessToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authValidators.register, validate, authController.register);
router.post('/login', authValidators.login, validate, authController.login);
router.post('/refresh', authValidators.refresh, validate, authController.refresh);

router.get('/me', verifyAccessToken, authController.me);
router.patch('/me', verifyAccessToken, authValidators.updateMe, validate, authController.updateMe);
router.post('/logout', verifyAccessToken, authValidators.logout, validate, authController.logout);
router.get('/sesiones', verifyAccessToken, authController.listSesiones);
router.delete('/sesiones/:id', verifyAccessToken, authController.revokeSesion);
router.delete('/sesiones', verifyAccessToken, authController.revokeAllSesiones);

module.exports = router;
