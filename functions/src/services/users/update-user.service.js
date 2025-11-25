const Joi = require('joi');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const updateUserSchema = Joi.object({
  displayName: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres'
  }),
  username: Joi.string().alphanum().min(3).max(30).optional().messages({
    'string.alphanum': 'El username solo puede contener letras y números',
    'string.min': 'El username debe tener al menos 3 caracteres',
    'string.max': 'El username no puede exceder 30 caracteres'
  }),
  bio: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'La biografía no puede exceder 200 caracteres'
  }),
  avatar: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'El avatar debe ser una URL válida'
  })
});

const updateUserService = async (userId, data) => {
  // 1. Validar que el usuario existe
  const user = await usersRepository.getUserById(userId);
  
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Validar datos con Joi
  const { error, value } = updateUserSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 3. Si se actualiza displayName, también actualizarlo en Firebase Auth
  if (value.displayName) {
    await usersRepository.updateUserAuth(userId, value.displayName);
  }

  // 4. Actualizar datos en Realtime Database
  await usersRepository.updateUser(userId, value);

  return {
    uid: userId,
    ...user,
    ...value,
    updatedAt: new Date().toISOString()
  };
};

module.exports = updateUserService;