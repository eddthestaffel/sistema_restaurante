const { body, param } = require('express-validator');

const create = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('pais').trim().notEmpty().withMessage('El país es obligatorio'),
];

const update = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('nombre').optional().trim().notEmpty(),
  body('pais').optional().trim().notEmpty(),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID inválido')];
const marcaIdParam = [param('marcaId').isInt({ min: 1 }).withMessage('marcaId inválido')];

module.exports = { create, update, idParam, marcaIdParam };
