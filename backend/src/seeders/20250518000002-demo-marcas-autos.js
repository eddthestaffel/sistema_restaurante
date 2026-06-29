'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('marcas', [
      { nombre: 'Toyota', pais: 'Japón', createdAt: now, updatedAt: now },
      { nombre: 'Chevrolet', pais: 'Estados Unidos', createdAt: now, updatedAt: now },
      { nombre: 'Hyundai', pais: 'Corea del Sur', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('autos', [
      {
        marcaId: 1,
        modelo: 'Corolla',
        anio: 2022,
        patente: 'AABB11',
        createdAt: now,
        updatedAt: now,
      },
      {
        marcaId: 1,
        modelo: 'RAV4',
        anio: 2023,
        patente: 'CCDD22',
        createdAt: now,
        updatedAt: now,
      },
      {
        marcaId: 2,
        modelo: 'Sail',
        anio: 2021,
        patente: 'EEFF33',
        createdAt: now,
        updatedAt: now,
      },
      {
        marcaId: 3,
        modelo: 'Tucson',
        anio: 2024,
        patente: 'GGHH44',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('autos', null, {});
    await queryInterface.bulkDelete('marcas', null, {});
  },
};
