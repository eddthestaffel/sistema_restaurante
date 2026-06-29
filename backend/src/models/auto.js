'use strict';

module.exports = (sequelize, DataTypes) => {
  const Auto = sequelize.define(
    'Auto',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marcaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modelo: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1900,
          max: new Date().getFullYear() + 1,
        },
      },
      patente: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'autos',
    }
  );

  Auto.associate = (models) => {
    Auto.belongsTo(models.Marca, {
      foreignKey: 'marcaId',
      as: 'marca',
    });
  };

  return Auto;
};
