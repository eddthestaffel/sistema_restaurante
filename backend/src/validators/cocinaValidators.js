const { body, param, query } = require('express-validator');

const estadosCocina = ['pendiente', 'preparando', 'listo'];

const listQuery = [
  query('estadoCocina').optional().isIn(estadosCocina),
];

const cambiarEstado = [
  param('itemId').isInt({ min: 1 }).withMessage('ID invalido'),
  body('estadoCocina').isIn(estadosCocina).withMessage('Estado de cocina invalido'),
];

module.exports = { listQuery, cambiarEstado };
