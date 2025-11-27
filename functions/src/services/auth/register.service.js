const Joi = require('joi');
const authRepository = require('../../repositories/auth.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email debe ser válido',
    'any.required': 'El email es obligatorio'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'La contraseña es obligatoria'
  }),
  displayName: Joi.string().min(3).required().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'any.required': 'El nombre es obligatorio'
  }),
  username: Joi.string().alphanum().min(3).required().messages({
    'string.alphanum': 'El username solo puede contener letras y números',
    'string.min': 'El username debe tener al menos 3 caracteres',
    'any.required': 'El username es obligatorio'
  }),
  firstName: Joi.string().min(2).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'any.required': 'El nombre es obligatorio'
  }),
  lastName: Joi.string().min(2).required().messages({
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'any.required': 'El apellido es obligatorio'
  }),
  phoneNumber: Joi.string().allow('', null).optional()
});

const registerService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = registerSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Verificar si el email ya existe
  const existingUser = await authRepository.findUserByEmail(value.email);
  if (existingUser) {
    const err = new Error('El email ya está registrado');
    err.statusCode = httpStatus.CONFLICT;
    throw err;
  }

  // 3. Verificar si el username ya existe
  const existingUsername = await authRepository.findUserByUsername(value.username);
  if (existingUsername) {
    const err = new Error('El username ya está en uso');
    err.statusCode = httpStatus.CONFLICT;
    throw err;
  }

  // 4. Crear usuario en Firebase Auth
  const userRecord = await authRepository.createUser(value);

  // 5. Guardar información adicional en Realtime Database
    const userData = {
    email: value.email,
    displayName: value.displayName,
    username: value.username,
    firstName: value.firstName,
    lastName: value.lastName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (value.phoneNumber) {
    userData.phoneNumber = value.phoneNumber;
  }

  await authRepository.saveUserData(userRecord.uid, userData);

    return {
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: value.displayName,
    username: value.username,
    firstName: value.firstName,
    lastName: value.lastName,
    phoneNumber: value.phoneNumber
  };
};

module.exports = registerService;