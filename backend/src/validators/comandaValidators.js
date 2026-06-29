const { body, param, query } = require('express-validator');

const estados = ['abierta', 'cerrada'];

const abrir = [
  body('mesaId').isInt({ min: 1 }).withMessage('mesaId es obligatorio'),
];

const agregarItem = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('menuItemId').isInt({ min: 1 }).withMessage('menuItemId es obligatorio'),
  body('cantidad').optional().isInt({ min: 1 }).withMessage('Cantidad invalida'),
];

const cerrar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('propina').optional().isInt({ min: 0 }).withMessage('Propina invalida'),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID invalido')];
const listQuery = [
  query('estado').optional().isIn(estados),
  query('mesaId').optional().isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { abrir, agregarItem, cerrar, idParam, listQuery };
