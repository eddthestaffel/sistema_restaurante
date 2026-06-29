const express = require('express');
const config = require('../config');
const authRoutes = require('./authRoutes');
const mesaRoutes = require('./mesaRoutes');
const menuRoutes = require('./menuRoutes');
const comandaRoutes = require('./comandaRoutes');
const cocinaRoutes = require('./cocinaRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: `Bienvenido a ${config.app.name}`,
    version: config.app.version,
    docs: '/docs (ver carpeta docs/ en el repositorio)',
  });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/mesas', mesaRoutes);
router.use('/menu', menuRoutes);
router.use('/comandas', comandaRoutes);
router.use('/cocina', cocinaRoutes);

module.exports = router;
