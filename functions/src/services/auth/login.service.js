const Joi = require('joi');
const axios = require('axios');
const authRepository = require('../../repositories/auth.repository');
const httpStatus = require('../../utils/httpStatusCode');
const { WEB_API_KEY } = require('../../config/environment');

// Esquema de validación con Joi
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio'
  }),
  password: Joi.string().required().messages({
    'any.required': 'La contraseña es obligatoria'
  })
});

const loginService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = loginSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  try {
    // 2. Validar email y contraseña usando Firebase Auth REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`,
      {
        email: value.email,
        password: value.password,
        returnSecureToken: true
      }
    );

    const { localId, idToken } = response.data;

    // 3. Obtener datos adicionales del usuario desde Realtime Database
    const userData = await authRepository.getUserData(localId);

    if (!userData) {
      const err = new Error('Usuario no encontrado en la base de datos');
      err.statusCode = httpStatus.NOT_FOUND;
      throw err;
    }

    // 4. Retornar usuario autenticado
    return {
      uid: localId,
      email: value.email,
      displayName: userData.displayName,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      image: userData.image,
      token: idToken
    };

  } catch (error) {
    // Manejar errores específicos de Firebase Auth
    if (
      error.response?.data?.error?.message === 'INVALID_PASSWORD' || 
      error.response?.data?.error?.message === 'INVALID_LOGIN_CREDENTIALS' ||
      error.response?.data?.error?.message === 'EMAIL_NOT_FOUND'
    ) {
      const err = new Error('Correo o contraseña incorrectos');
      err.statusCode = httpStatus.UNAUTHORIZED;
      throw err;
    }

    if (error.response?.data?.error?.message === 'USER_DISABLED') {
      const err = new Error('Usuario deshabilitado');
      err.statusCode = httpStatus.FORBIDDEN;
      throw err;
    }

    // Si ya tiene statusCode, es un error que lanzamos nosotros
    if (error.statusCode) {
      throw error;
    }

    // Error genérico
    console.error('Error en loginService:', error);
    const err = new Error('Error al iniciar sesión');
    err.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    throw err;
  }
};

module.exports = loginService;