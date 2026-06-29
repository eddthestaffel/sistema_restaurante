const db = require('../models');
const { AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');

const { ComandaItem, Comanda, Mesa, MenuItem } = db;

const list = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.estadoCocina) where.estadoCocina = req.query.estadoCocina;

  const items = await ComandaItem.findAll({
    where,
    include: [
      { model: MenuItem, as: 'menuItem' },
      {
        model: Comanda,
        as: 'comanda',
        where: { estado: 'abierta' },
        include: [{ model: Mesa, as: 'mesa' }],
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  res.json({ success: true, data: items });
});

const cambiarEstado = asyncHandler(async (req, res) => {
  const item = await ComandaItem.findByPk(req.params.itemId);
  if (!item) throw new AppError('Item de comanda no encontrado', 404);

  await item.update({ estadoCocina: req.body.estadoCocina });
  res.json({ success: true, data: item });
});

module.exports = { list, cambiarEstado };
