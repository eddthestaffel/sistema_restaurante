'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('mesas', [
      { numero: 1, capacidad: 2, ubicacion: 'Salon principal', estado: 'libre', createdAt: now, updatedAt: now },
      { numero: 2, capacidad: 4, ubicacion: 'Salon principal', estado: 'libre', createdAt: now, updatedAt: now },
      { numero: 3, capacidad: 6, ubicacion: 'Terraza', estado: 'libre', createdAt: now, updatedAt: now },
      { numero: 4, capacidad: 4, ubicacion: 'Terraza', estado: 'libre', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('menu_items', [
      { nombre: 'Empanadas de queso', descripcion: 'Porcion de 3 unidades', categoria: 'Entrada', precio: 4500, activo: true, createdAt: now, updatedAt: now },
      { nombre: 'Ensalada chilena', descripcion: 'Tomate, cebolla y cilantro', categoria: 'Entrada', precio: 3900, activo: true, createdAt: now, updatedAt: now },
      { nombre: 'Lomo saltado', descripcion: 'Plato de fondo con papas fritas', categoria: 'Fondo', precio: 10900, activo: true, createdAt: now, updatedAt: now },
      { nombre: 'Pastel de choclo', descripcion: 'Receta de la casa', categoria: 'Fondo', precio: 9900, activo: true, createdAt: now, updatedAt: now },
      { nombre: 'Jugo natural', descripcion: 'Sabores de temporada', categoria: 'Bebestible', precio: 3200, activo: true, createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('menu_items', null, {});
    await queryInterface.bulkDelete('mesas', null, {});
  },
};
