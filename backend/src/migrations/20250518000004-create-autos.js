'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('autos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marcaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'marcas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      modelo: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      anio: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      patente: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
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
    await queryInterface.addIndex('autos', ['marcaId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('autos');
  },
};
