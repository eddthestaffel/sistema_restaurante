'use strict';

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tokenHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      userAgent: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'refresh_tokens',
    }
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario',
    });
  };

  RefreshToken.prototype.isActive = function isActive() {
    return !this.revokedAt && this.expiresAt > new Date();
  };

  RefreshToken.prototype.toSessionJSON = function toSessionJSON() {
    return {
      id: this.id,
      userAgent: this.userAgent,
      ip: this.ip,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      activa: this.isActive(),
    };
  };

  return RefreshToken;
};
