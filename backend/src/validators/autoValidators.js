const { body, param, query } = require('express-validator');

const create = [
  body('modelo').trim().notEmpty().withMessage('El modelo es obligatorio'),
  body('anio')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Año inválido'),
  body('patente').trim().notEmpty().withMessage('La patente es obligatoria'),
  body('marcaId')
    .if((value, { req }) => !req.params.marcaId)
    .isInt({ min: 1 })
    .withMessage('marcaId es obligatorio'),
];

const update = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('modelo').optional().trim().notEmpty(),
  body('anio')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('patente').optional().trim().notEmpty(),
  body('marcaId').optional().isInt({ min: 1 }),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID inválido')];
const marcaIdParam = [param('marcaId').isInt({ min: 1 }).withMessage('marcaId inválido')];
const listQuery = [
  query('marcaId').optional().isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { create, update, idParam, marcaIdParam, listQuery };
