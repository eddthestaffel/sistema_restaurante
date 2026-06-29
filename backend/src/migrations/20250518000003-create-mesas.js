'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mesas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
      ubicacion: {
        type: Sequelize.STRING(80),
        allowNull: false,
        defaultValue: 'Salon',
      },
      estado: {
        type: Sequelize.ENUM('libre', 'ocupada'),
        allowNull: false,
        defaultValue: 'libre',
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
    await queryInterface.dropTable('mesas');
  },
};
