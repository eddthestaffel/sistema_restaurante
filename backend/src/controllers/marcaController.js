const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const { Marca, Auto } = db;

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${req.query.search}%` } },
      { pais: { [Op.like]: `%${req.query.search}%` } },
    ];
  }

  const { rows, count } = await Marca.findAndCountAll({
    where,
    limit,
    offset,
    order: [['nombre', 'ASC']],
  });

  res.json({
    success: true,
    ...buildPaginatedResponse(rows, count, { page, limit }),
  });
});

const getById = asyncHandler(async (req, res) => {
  const marca = await Marca.findByPk(req.params.id);
  if (!marca) {
    throw new AppError('Marca no encontrada', 404);
  }
  res.json({ success: true, data: marca });
});

const create = asyncHandler(async (req, res) => {
  const marca = await Marca.create(req.body);
  res.status(201).json({ success: true, data: marca });
});

const replace = asyncHandler(async (req, res) => {
  const marca = await Marca.findByPk(req.params.id);
  if (!marca) {
    throw new AppError('Marca no encontrada', 404);
  }
  await marca.update({
    nombre: req.body.nombre,
    pais: req.body.pais,
  });
  res.json({ success: true, data: marca });
});

const patch = asyncHandler(async (req, res) => {
  const marca = await Marca.findByPk(req.params.id);
  if (!marca) {
    throw new AppError('Marca no encontrada', 404);
  }
  await marca.update(req.body);
  res.json({ success: true, data: marca });
});

const remove = asyncHandler(async (req, res) => {
  const marca = await Marca.findByPk(req.params.id);
  if (!marca) {
    throw new AppError('Marca no encontrada', 404);
  }

  const autosCount = await Auto.count({ where: { marcaId: marca.id } });
  if (autosCount > 0) {
    throw new AppError(
      'No se puede eliminar la marca porque tiene autos asociados',
      409
    );
  }

  await marca.destroy();
  res.status(204).send();
});

module.exports = { list, getById, create, replace, patch, remove };
