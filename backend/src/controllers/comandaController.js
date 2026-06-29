const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const { Mesa, MenuItem, Comanda, ComandaItem, sequelize } = db;

const includeCompleta = [
  { model: Mesa, as: 'mesa' },
  {
    model: ComandaItem,
    as: 'items',
    include: [{ model: MenuItem, as: 'menuItem' }],
  },
];

const recalcularTotales = async (comanda, propina = comanda.propina || 0, transaction) => {
  const items = await ComandaItem.findAll({
    where: { comandaId: comanda.id },
    transaction,
  });
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  await comanda.update({ subtotal, propina, total: subtotal + propina }, { transaction });
};

const list = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};

  if (req.query.estado) where.estado = req.query.estado;
  if (req.query.mesaId) where.mesaId = req.query.mesaId;

  const { rows, count } = await Comanda.findAndCountAll({
    where,
    include: includeCompleta,
    limit,
    offset,
    distinct: true,
    order: [['createdAt', 'DESC']],
  });

  res.json({ success: true, ...buildPaginatedResponse(rows, count, { page, limit }) });
});

const getById = asyncHandler(async (req, res) => {
  const comanda = await Comanda.findByPk(req.params.id, { include: includeCompleta });
  if (!comanda) throw new AppError('Comanda no encontrada', 404);
  res.json({ success: true, data: comanda });
});

const abrir = asyncHandler(async (req, res) => {
  const comanda = await sequelize.transaction(async (transaction) => {
    const mesa = await Mesa.findByPk(req.body.mesaId, { transaction });
    if (!mesa) throw new AppError('Mesa no encontrada', 404);

    const abierta = await Comanda.findOne({
      where: { mesaId: mesa.id, estado: 'abierta' },
      transaction,
    });
    if (abierta) throw new AppError('La mesa ya tiene una comanda abierta', 409);

    await mesa.update({ estado: 'ocupada' }, { transaction });
    return Comanda.create({ mesaId: mesa.id }, { transaction });
  });

  const completa = await Comanda.findByPk(comanda.id, { include: includeCompleta });
  res.status(201).json({ success: true, data: completa });
});

const agregarItem = asyncHandler(async (req, res) => {
  const comandaId = req.params.id;

  await sequelize.transaction(async (transaction) => {
    const comanda = await Comanda.findByPk(comandaId, { transaction });
    if (!comanda) throw new AppError('Comanda no encontrada', 404);
    if (comanda.estado !== 'abierta') throw new AppError('La comanda ya esta cerrada', 409);

    const menuItem = await MenuItem.findByPk(req.body.menuItemId, { transaction });
    if (!menuItem || !menuItem.activo) throw new AppError('Item de menu no disponible', 404);

    const cantidad = req.body.cantidad || 1;
    await ComandaItem.create(
      {
        comandaId: comanda.id,
        menuItemId: menuItem.id,
        cantidad,
        precioUnitario: menuItem.precio,
        subtotal: menuItem.precio * cantidad,
      },
      { transaction }
    );

    await recalcularTotales(comanda, comanda.propina, transaction);
  });

  const completa = await Comanda.findByPk(comandaId, { include: includeCompleta });
  res.status(201).json({ success: true, data: completa });
});

const total = asyncHandler(async (req, res) => {
  const comanda = await Comanda.findByPk(req.params.id, { include: includeCompleta });
  if (!comanda) throw new AppError('Comanda no encontrada', 404);
  res.json({
    success: true,
    data: {
      comandaId: comanda.id,
      mesaId: comanda.mesaId,
      estado: comanda.estado,
      subtotal: comanda.subtotal,
      propina: comanda.propina,
      total: comanda.total,
      items: comanda.items,
    },
  });
});

const cerrar = asyncHandler(async (req, res) => {
  const propina = req.body.propina || 0;
  const comandaId = req.params.id;

  await sequelize.transaction(async (transaction) => {
    const comanda = await Comanda.findByPk(comandaId, { transaction });
    if (!comanda) throw new AppError('Comanda no encontrada', 404);
    if (comanda.estado === 'cerrada') throw new AppError('La comanda ya esta cerrada', 409);

    await recalcularTotales(comanda, propina, transaction);
    await comanda.update({ estado: 'cerrada', cerradaEn: new Date() }, { transaction });
    await Mesa.update({ estado: 'libre' }, { where: { id: comanda.mesaId }, transaction });
  });

  const completa = await Comanda.findByPk(comandaId, { include: includeCompleta });
  res.json({ success: true, data: completa });
});

module.exports = { list, getById, abrir, agregarItem, total, cerrar };
