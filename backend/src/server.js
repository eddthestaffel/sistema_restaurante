require('dotenv').config();
const app = require('./app');
const config = require('./config');
const db = require('./models');

const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    app.listen(config.port, () => {
      console.log(`${config.app.name} v${config.app.version} en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

start();
