const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require('sequelize');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  if (err.name === 'SequelizeValidationError' || err instanceof ValidationError) {
    statusCode = 400;
    message = 'Error de validación en base de datos';
    details = err.errors?.map((e) => ({ field: e.path, message: e.message }));
  }

  if (err.name === 'SequelizeUniqueConstraintError' || err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'Registro duplicado';
    details = err.errors?.map((e) => ({ field: e.path, message: e.message }));
  }

  if (err.name === 'SequelizeForeignKeyConstraintError' || err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = 'Referencia inválida';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

module.exports = errorHandler;
