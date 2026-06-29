'use strict';

module.exports = (sequelize, DataTypes) => {
  const ComandaItem = sequelize.define(
    'ComandaItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comandaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
      },
      precioUnitario: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estadoCocina: {
        type: DataTypes.ENUM('pendiente', 'preparando', 'listo'),
        allowNull: false,
        defaultValue: 'pendiente',
      },
    },
    {
      tableName: 'comanda_items',
    }
  );

  ComandaItem.associate = (models) => {
    ComandaItem.belongsTo(models.Comanda, {
      foreignKey: 'comandaId',
      as: 'comanda',
    });
    ComandaItem.belongsTo(models.MenuItem, {
      foreignKey: 'menuItemId',
      as: 'menuItem',
    });
  };

  return ComandaItem;
};
