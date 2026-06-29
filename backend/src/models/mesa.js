'use strict';

module.exports = (sequelize, DataTypes) => {
  const Mesa = sequelize.define(
    'Mesa',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
        validate: { min: 1 },
      },
      ubicacion: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: 'Salon',
      },
      estado: {
        type: DataTypes.ENUM('libre', 'ocupada'),
        allowNull: false,
        defaultValue: 'libre',
      },
    },
    {
      tableName: 'mesas',
    }
  );

  Mesa.associate = (models) => {
    Mesa.hasMany(models.Comanda, {
      foreignKey: 'mesaId',
      as: 'comandas',
    });
  };

  return Mesa;
};
