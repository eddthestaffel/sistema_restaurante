'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('usuarios', [
      {
        email: 'profesor@ejemplo.cl',
        passwordHash: await bcrypt.hash('demo1234', 10),
        nombre: 'Usuario Demo',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuarios', { email: 'profesor@ejemplo.cl' });
  },
};
