const { body } = require('express-validator');

const register = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
];

const login = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

const refresh = [
  body('refreshToken').notEmpty().withMessage('refreshToken es obligatorio'),
];

const logout = [
  body('refreshToken').notEmpty().withMessage('refreshToken es obligatorio'),
];

const updateMe = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
  body('passwordActual')
    .if(body('password').exists())
    .notEmpty()
    .withMessage('passwordActual es obligatorio para cambiar la contraseña'),
];

module.exports = { register, login, refresh, logout, updateMe };
