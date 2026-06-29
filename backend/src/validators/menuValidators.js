const { body, param, query } = require('express-validator');

const create = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion').optional({ nullable: true }).trim(),
  body('categoria').optional().trim().notEmpty(),
  body('precio').isInt({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),
  body('activo').optional().isBoolean(),
];

const update = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('nombre').optional().trim().notEmpty(),
  body('descripcion').optional({ nullable: true }).trim(),
  body('categoria').optional().trim().notEmpty(),
  body('precio').optional().isInt({ min: 0 }),
  body('activo').optional().isBoolean(),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID invalido')];
const listQuery = [
  query('activo').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { create, update, idParam, listQuery };
