'use strict';

module.exports = (sequelize, DataTypes) => {
  const Marca = sequelize.define(
    'Marca',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      pais: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
    },
    {
      tableName: 'marcas',
    }
  );

  Marca.associate = (models) => {
    Marca.hasMany(models.Auto, {
      foreignKey: 'marcaId',
      as: 'autos',
    });
  };

  return Marca;
};
