'use strict';

module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define(
    'MenuItem',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      categoria: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: 'General',
      },
      precio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'menu_items',
    }
  );

  MenuItem.associate = (models) => {
    MenuItem.hasMany(models.ComandaItem, {
      foreignKey: 'menuItemId',
      as: 'comandaItems',
    });
  };

  return MenuItem;
};
