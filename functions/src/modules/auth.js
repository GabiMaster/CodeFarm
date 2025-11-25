const express = require('express');
const router = express.Router();
const registerService = require('../services/auth/register.service');
const loginService = require('../services/auth/login.service');
const changePasswordService = require('../services/auth/change-password.service');
const { sendSuccess, sendError } = require('../utils/response');
const httpStatus = require('../utils/httpStatusCode');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const result = await registerService(req.body);
    return sendSuccess(res, httpStatus.CREATED, 'Usuario registrado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const result = await loginService(req.body);
    return sendSuccess(res, httpStatus.OK, 'Login exitoso', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// POST /auth/change-password
router.post('/change-password', async (req, res) => {
  try {
    const result = await changePasswordService(req.body);
    return sendSuccess(res, httpStatus.OK, 'Contraseña actualizada exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;