const { Op } = require('sequelize');
const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const { Auto, Marca } = db;

const marcaInclude = {
  model: Marca,
  as: 'marca',
  attributes: ['id', 'nombre', 'pais'],
};

const buildListWhere = (query) => {
  const where = {};
  if (query.marcaId) {
    where.marcaId = query.marcaId;
  }
  if (query.search) {
    where[Op.or] = [
      { modelo: { [Op.like]: `%${query.search}%` } },
      { patente: { [Op.like]: `%${query.search}%` } },
    ];
  }
  return where;
};

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);

  const { rows, count } = await Auto.findAndCountAll({
    where: buildListWhere(req.query),
    include: [marcaInclude],
    limit,
    offset,
    order: [['modelo', 'ASC']],
  });

  res.json({
    success: true,
    ...buildPaginatedResponse(rows, count, { page, limit }),
  });
});

const getById = asyncHandler(async (req, res) => {
  const auto = await Auto.findByPk(req.params.id, { include: [marcaInclude] });
  if (!auto) {
    throw new AppError('Auto no encontrado', 404);
  }
  res.json({ success: true, data: auto });
});

const ensureMarcaExists = async (marcaId) => {
  const marca = await Marca.findByPk(marcaId);
  if (!marca) {
    throw new AppError('Marca no encontrada', 404);
  }
  return marca;
};

const create = asyncHandler(async (req, res) => {
  const marcaId = req.body.marcaId || req.params.marcaId;
  await ensureMarcaExists(marcaId);

  const auto = await Auto.create({
    modelo: req.body.modelo,
    anio: req.body.anio,
    patente: req.body.patente,
    marcaId,
  });

  const withMarca = await Auto.findByPk(auto.id, { include: [marcaInclude] });
  res.status(201).json({ success: true, data: withMarca });
});

const replace = asyncHandler(async (req, res) => {
  const auto = await Auto.findByPk(req.params.id);
  if (!auto) {
    throw new AppError('Auto no encontrado', 404);
  }

  await ensureMarcaExists(req.body.marcaId);
  await auto.update({
    modelo: req.body.modelo,
    anio: req.body.anio,
    patente: req.body.patente,
    marcaId: req.body.marcaId,
  });

  const withMarca = await Auto.findByPk(auto.id, { include: [marcaInclude] });
  res.json({ success: true, data: withMarca });
});

const patch = asyncHandler(async (req, res) => {
  const auto = await Auto.findByPk(req.params.id);
  if (!auto) {
    throw new AppError('Auto no encontrado', 404);
  }

  if (req.body.marcaId) {
    await ensureMarcaExists(req.body.marcaId);
  }

  await auto.update(req.body);
  const withMarca = await Auto.findByPk(auto.id, { include: [marcaInclude] });
  res.json({ success: true, data: withMarca });
});

const remove = asyncHandler(async (req, res) => {
  const auto = await Auto.findByPk(req.params.id);
  if (!auto) {
    throw new AppError('Auto no encontrado', 404);
  }
  await auto.destroy();
  res.status(204).send();
});

const listByMarca = asyncHandler(async (req, res) => {
  await ensureMarcaExists(req.params.marcaId);
  const { page, limit, offset } = parsePagination(req.query);

  const where = { marcaId: req.params.marcaId };
  if (req.query.search) {
    where[Op.or] = [
      { modelo: { [Op.like]: `%${req.query.search}%` } },
      { patente: { [Op.like]: `%${req.query.search}%` } },
    ];
  }

  const { rows, count } = await Auto.findAndCountAll({
    where,
    include: [marcaInclude],
    limit,
    offset,
    order: [['modelo', 'ASC']],
  });

  res.json({
    success: true,
    ...buildPaginatedResponse(rows, count, { page, limit }),
  });
});

module.exports = {
  list,
  getById,
  create,
  replace,
  patch,
  remove,
  listByMarca,
};
