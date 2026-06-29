'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comandas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mesaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mesas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      estado: {
        type: Sequelize.ENUM('abierta', 'cerrada'),
        allowNull: false,
        defaultValue: 'abierta',
      },
      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      propina: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cerradaEn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comandas');
  },
};
