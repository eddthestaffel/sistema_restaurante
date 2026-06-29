'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
    },
    {
      tableName: 'usuarios',
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['passwordHash'] },
        },
      },
    }
  );

  Usuario.associate = (models) => {
    Usuario.hasMany(models.RefreshToken, {
      foreignKey: 'usuarioId',
      as: 'sesiones',
    });
  };

  Usuario.hashPassword = async (password) => bcrypt.hash(password, 10);

  Usuario.prototype.validatePassword = async function validatePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  Usuario.prototype.toSafeJSON = function toSafeJSON() {
    return {
      id: this.id,
      email: this.email,
      nombre: this.nombre,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  };

  return Usuario;
};
