const db = require('../models');
const { AppError } = require('../utils/errors');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const { Usuario } = db;

const register = asyncHandler(async (req, res) => {
  const { email, password, nombre } = req.body;

  const exists = await Usuario.unscoped().findOne({ where: { email } });
  if (exists) {
    throw new AppError('El email ya está registrado', 409);
  }

  const passwordHash = await Usuario.hashPassword(password);
  const usuario = await Usuario.create({ email, passwordHash, nombre });

  res.status(201).json({
    success: true,
    data: usuario.toSafeJSON(),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.scope('withPassword').findOne({ where: { email } });
  if (!usuario || !(await usuario.validatePassword(password))) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const tokens = await authService.issueTokens(usuario, {
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });

  res.json({
    success: true,
    data: {
      usuario: usuario.toSafeJSON(),
      ...tokens,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  res.json({ success: true, data: tokens });
});

const logout = asyncHandler(async (req, res) => {
  await authService.revokeSession(req.body.refreshToken);
  res.status(204).send();
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.usuario.toSafeJSON() });
});

const updateMe = asyncHandler(async (req, res) => {
  const { nombre, password, passwordActual } = req.body;
  const usuario = await Usuario.scope('withPassword').findByPk(req.usuario.id);

  if (password) {
    const valid = await usuario.validatePassword(passwordActual);
    if (!valid) {
      throw new AppError('Contraseña actual incorrecta', 400);
    }
    usuario.passwordHash = await Usuario.hashPassword(password);
  }

  if (nombre) {
    usuario.nombre = nombre;
  }

  await usuario.save();

  const safe = await Usuario.findByPk(usuario.id);
  res.json({ success: true, data: safe.toSafeJSON() });
});

const listSesiones = asyncHandler(async (req, res) => {
  const sesiones = await authService.listActiveSessions(req.usuario.id);
  res.json({ success: true, data: sesiones });
});

const revokeSesion = asyncHandler(async (req, res) => {
  await authService.revokeSessionById(req.usuario.id, parseInt(req.params.id, 10));
  res.status(204).send();
});

const revokeAllSesiones = asyncHandler(async (req, res) => {
  let exceptSessionId = null;
  if (req.query.except === 'current' && req.body.refreshToken) {
    exceptSessionId = await authService.getCurrentSessionIdFromToken(
      req.body.refreshToken
    );
  }
  await authService.revokeAllSessions(req.usuario.id, exceptSessionId);
  res.status(204).send();
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  updateMe,
  listSesiones,
  revokeSesion,
  revokeAllSesiones,
};
