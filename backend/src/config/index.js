require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_cambiar_en_produccion',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_cambiar_en_produccion',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  app: {
    name: 'API Restaurante',
    version: '1.0.0',
  },
};
