require('dotenv').config();
const path = require('path');

const dialect = process.env.DB_DIALECT || 'mysql';
const storage =
  process.env.DB_STORAGE || path.resolve(__dirname, '../../database.sqlite');

const shared = {
  dialect,
  database: process.env.DB_NAME || 'restaurante_db',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  storage,
  logging: false,
};

module.exports = {
  development: shared,
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: shared,
};
