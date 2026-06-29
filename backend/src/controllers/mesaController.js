const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const { Mesa, Comanda } = db;

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};

  if (req.query.estado) where.estado = req.query.estado;
  if (req.query.search) {
    where[Op.or] = [
      { ubicacion: { [Op.like]: `%${req.query.search}%` } },
      { numero: Number(req.query.search) || 0 },
    ];
  }

  const { rows, count } = await Mesa.findAndCountAll({
    where,
    limit,
    offset,
    order: [['numero', 'ASC']],
  });

  res.json({ success: true, ...buildPaginatedResponse(rows, count, { page, limit }) });
});

const salon = asyncHandler(async (req, res) => {
  const mesas = await Mesa.findAll({
    include: [
      {
        model: Comanda,
        as: 'comandas',
        where: { estado: 'abierta' },
        required: false,
      },
    ],
    order: [['numero', 'ASC']],
  });

  res.json({ success: true, data: mesas });
});

const getById = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id);
  if (!mesa) throw new AppError('Mesa no encontrada', 404);
  res.json({ success: true, data: mesa });
});

const create = asyncHandler(async (req, res) => {
  const mesa = await Mesa.create(req.body);
  res.status(201).json({ success: true, data: mesa });
});

const patch = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id);
  if (!mesa) throw new AppError('Mesa no encontrada', 404);

  if (req.body.estado === 'libre') {
    const abierta = await Comanda.findOne({
      where: { mesaId: mesa.id, estado: 'abierta' },
    });
    if (abierta) {
      throw new AppError('No se puede liberar una mesa con comanda abierta', 409);
    }
  }

  await mesa.update(req.body);
  res.json({ success: true, data: mesa });
});

const remove = asyncHandler(async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id);
  if (!mesa) throw new AppError('Mesa no encontrada', 404);

  const comandas = await Comanda.count({ where: { mesaId: mesa.id } });
  if (comandas > 0) {
    throw new AppError('No se puede eliminar la mesa porque tiene comandas asociadas', 409);
  }

  await mesa.destroy();
  res.status(204).send();
});

module.exports = { list, salon, getById, create, patch, remove };
