'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comanda = sequelize.define(
    'Comanda',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mesaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM('abierta', 'cerrada'),
        allowNull: false,
        defaultValue: 'abierta',
      },
      subtotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      propina: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cerradaEn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'comandas',
    }
  );

  Comanda.associate = (models) => {
    Comanda.belongsTo(models.Mesa, {
      foreignKey: 'mesaId',
      as: 'mesa',
    });
    Comanda.hasMany(models.ComandaItem, {
      foreignKey: 'comandaId',
      as: 'items',
    });
  };

  return Comanda;
};
