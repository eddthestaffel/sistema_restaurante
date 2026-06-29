const { body, param, query } = require('express-validator');

const estados = ['libre', 'ocupada'];

const create = [
  body('numero').isInt({ min: 1 }).withMessage('El numero de mesa es obligatorio'),
  body('capacidad').optional().isInt({ min: 1 }).withMessage('Capacidad invalida'),
  body('ubicacion').optional().trim().notEmpty(),
  body('estado').optional().isIn(estados).withMessage('Estado invalido'),
];

const update = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('numero').optional().isInt({ min: 1 }),
  body('capacidad').optional().isInt({ min: 1 }),
  body('ubicacion').optional().trim().notEmpty(),
  body('estado').optional().isIn(estados).withMessage('Estado invalido'),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID invalido')];
const listQuery = [
  query('estado').optional().isIn(estados),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { create, update, idParam, listQuery };
