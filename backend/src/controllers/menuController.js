const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const { MenuItem } = db;

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};

  if (req.query.categoria) where.categoria = req.query.categoria;
  if (req.query.activo !== undefined) where.activo = req.query.activo === 'true';
  if (req.query.search) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${req.query.search}%` } },
      { descripcion: { [Op.like]: `%${req.query.search}%` } },
      { categoria: { [Op.like]: `%${req.query.search}%` } },
    ];
  }

  const { rows, count } = await MenuItem.findAndCountAll({
    where,
    limit,
    offset,
    order: [['categoria', 'ASC'], ['nombre', 'ASC']],
  });

  res.json({ success: true, ...buildPaginatedResponse(rows, count, { page, limit }) });
});

const getById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new AppError('Item de menu no encontrado', 404);
  res.json({ success: true, data: item });
});

const create = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, data: item });
});

const patch = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new AppError('Item de menu no encontrado', 404);
  await item.update(req.body);
  res.json({ success: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new AppError('Item de menu no encontrado', 404);
  await item.update({ activo: false });
  res.json({ success: true, data: item });
});

module.exports = { list, getById, create, patch, remove };
