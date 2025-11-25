const Joi = require('joi');
const authRepository = require('../../repositories/auth.repository');
const httpStatus = require('../../utils/httpStatusCode');

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

  // 2. Verificar que el usuario existe en Firebase Auth
  const userRecord = await authRepository.getUserByEmail(value.email);
  
  if (!userRecord) {
    const err = new Error('Credenciales inválidas');
    err.statusCode = httpStatus.UNAUTHORIZED;
    throw err;
  }

  // 3. Obtener datos adicionales del usuario desde Realtime Database
  const userData = await authRepository.getUserData(userRecord.uid);

  if (!userData) {
    const err = new Error('Usuario no encontrado en la base de datos');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 4. Generar custom token para autenticación en el cliente
  const customToken = await authRepository.createCustomToken(userRecord.uid);

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userData.displayName,
    username: userData.username,
    token: customToken
  };
};

module.exports = loginService;